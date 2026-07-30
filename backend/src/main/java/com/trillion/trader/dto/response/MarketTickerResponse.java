package com.trillion.trader.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarketTickerResponse {
    private String symbol;
    private String label;
    private double value;
    private Double change; // Optional change percentage or absolute change
}
