package com.trillion.trader.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.trillion.trader.dto.response.MarketOverviewResponse;
import com.trillion.trader.dto.response.MarketTickerResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class MarketDataService {

    private final RestTemplate restTemplate;

    @Cacheable(value = "marketData")
    public List<MarketTickerResponse> getLiveTickerData() {
        List<MarketTickerResponse> tickers = new ArrayList<>();

        // 1. Fetch Crypto from Binance (BTC, ETH)
        try {
            tickers.add(fetchBinanceTicker("BTCUSDT", "BTC/USD", "Bitcoin"));
            tickers.add(fetchBinanceTicker("ETHUSDT", "ETH/USD", "Ethereum"));
        } catch (Exception e) {
            log.error("Failed to fetch from Binance: {}", e.getMessage());
            // Fallback to CoinGecko
            try {
                JsonNode cg = restTemplate.getForObject("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd", JsonNode.class);
                if (cg != null) {
                    tickers.add(new MarketTickerResponse("BTC/USD", "Bitcoin", cg.path("bitcoin").path("usd").asDouble(), null));
                    tickers.add(new MarketTickerResponse("ETH/USD", "Ethereum", cg.path("ethereum").path("usd").asDouble(), null));
                }
            } catch (Exception ex) {
                log.error("Failed to fetch from CoinGecko fallback: {}", ex.getMessage());
            }
        }

        // 2. Fetch Forex and Metals from ExchangeRate-API (Base USD)
        try {
            JsonNode er = restTemplate.getForObject("https://open.er-api.com/v6/latest/USD", JsonNode.class);
            if (er != null && er.has("rates")) {
                JsonNode rates = er.get("rates");
                
                // EUR/USD = 1 / USD_EUR
                addForexTicker(tickers, "EUR/USD", "Euro", rates, "EUR", true);
                addForexTicker(tickers, "GBP/USD", "Pound", rates, "GBP", true);
                addForexTicker(tickers, "AUD/USD", "Aussie", rates, "AUD", true);
                
                // USD/JPY = USD_JPY
                addForexTicker(tickers, "USD/JPY", "Yen", rates, "JPY", false);

                // Metals: XAU (1 oz Gold in USD = 1 / USD_XAU)
                addForexTicker(tickers, "XAU/USD", "Gold", rates, "XAU", true);
                addForexTicker(tickers, "XAG/USD", "Silver", rates, "XAG", true);
            }
        } catch (Exception e) {
            log.error("Failed to fetch from ExchangeRate-API: {}", e.getMessage());
        }

        return tickers;
    }

    @Cacheable(value = "marketOverview")
    public MarketOverviewResponse getMarketOverview() {
        MarketOverviewResponse overview = new MarketOverviewResponse();
        overview.setSession(calculateActiveSession());
        
        // Fetch Fear & Greed Index
        try {
            JsonNode fg = restTemplate.getForObject("https://api.alternative.me/fng/?limit=1", JsonNode.class);
            if (fg != null && fg.has("data")) {
                String val = fg.get("data").get(0).get("value").asText();
                String classification = fg.get("data").get(0).get("value_classification").asText();
                overview.setRiskMood(val + " (" + classification + ")");
            } else {
                overview.setRiskMood("Neutral");
            }
        } catch (Exception e) {
            log.error("Failed to fetch Fear & Greed: {}", e.getMessage());
            overview.setRiskMood("Unknown");
        }

        // Fetch DXY and VIX from Yahoo Finance API
        try {
            Double dxy = fetchYahooFinancePrice("DX-Y.NYB");
            overview.setDxyValue(dxy != null ? String.format("%.2f", dxy) : "N/A");
            
            Double vix = fetchYahooFinancePrice("^VIX");
            overview.setVixValue(vix != null ? String.format("%.2f", vix) : "N/A");
            
            if (vix != null) {
                overview.setVolatility(vix > 20 ? "High" : (vix < 12 ? "Low" : "Moderate"));
            } else {
                overview.setVolatility("Unknown");
            }
        } catch (Exception e) {
            log.error("Failed to fetch Indices: {}", e.getMessage());
            overview.setDxyValue("N/A");
            overview.setVixValue("N/A");
            overview.setVolatility("Unknown");
        }

        return overview;
    }

    private MarketTickerResponse fetchBinanceTicker(String symbol, String displaySymbol, String label) {
        JsonNode node = restTemplate.getForObject("https://api.binance.com/api/v3/ticker/24hr?symbol=" + symbol, JsonNode.class);
        if (node != null && node.has("lastPrice")) {
            return new MarketTickerResponse(displaySymbol, label, node.get("lastPrice").asDouble(), node.get("priceChangePercent").asDouble());
        }
        throw new RuntimeException("Invalid response from Binance");
    }

    private void addForexTicker(List<MarketTickerResponse> tickers, String symbol, String label, JsonNode rates, String currency, boolean invert) {
        if (rates.has(currency)) {
            double rate = rates.get(currency).asDouble();
            if (rate > 0) {
                double value = invert ? (1.0 / rate) : rate;
                tickers.add(new MarketTickerResponse(symbol, label, value, null));
            }
        }
    }

    private Double fetchYahooFinancePrice(String symbol) {
        try {
            JsonNode node = restTemplate.getForObject("https://query1.finance.yahoo.com/v8/finance/chart/" + symbol + "?interval=1d", JsonNode.class);
            if (node != null && node.has("chart")) {
                JsonNode result = node.get("chart").get("result");
                if (result != null && result.isArray() && result.size() > 0) {
                    return result.get(0).get("meta").get("regularMarketPrice").asDouble();
                }
            }
        } catch (Exception e) {
            log.warn("Yahoo Finance fetch failed for {}: {}", symbol, e.getMessage());
        }
        return null;
    }

    private String calculateActiveSession() {
        ZonedDateTime utcNow = ZonedDateTime.now(ZoneOffset.UTC);
        int hour = utcNow.getHour();

        // Very simplified UTC session calculation
        if (hour >= 23 || hour < 8) {
            return "Tokyo / Sydney";
        } else if (hour >= 8 && hour < 13) {
            return "London";
        } else if (hour >= 13 && hour < 17) {
            return "London + NY";
        } else {
            return "New York";
        }
    }
}
