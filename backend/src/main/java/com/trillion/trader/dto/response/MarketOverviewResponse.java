package com.trillion.trader.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarketOverviewResponse {
    private String session;
    private String volatility;
    private String riskMood;
    private String dxyValue;
    private String vixValue;
}
