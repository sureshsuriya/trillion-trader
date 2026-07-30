package com.trillion.trader.controller;

import com.trillion.trader.dto.ApiResponse;
import com.trillion.trader.dto.response.MarketOverviewResponse;
import com.trillion.trader.dto.response.MarketTickerResponse;
import com.trillion.trader.service.MarketDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/market")
@RequiredArgsConstructor
public class MarketDataController {

    private final MarketDataService marketDataService;

    @GetMapping("/ticker")
    public ResponseEntity<ApiResponse<List<MarketTickerResponse>>> getLiveTicker() {
        return ResponseEntity.ok(ApiResponse.success(marketDataService.getLiveTickerData(), "Ticker data fetched successfully"));
    }

    @GetMapping("/overview")
    public ResponseEntity<ApiResponse<MarketOverviewResponse>> getMarketOverview() {
        return ResponseEntity.ok(ApiResponse.success(marketDataService.getMarketOverview(), "Market overview fetched successfully"));
    }
}
