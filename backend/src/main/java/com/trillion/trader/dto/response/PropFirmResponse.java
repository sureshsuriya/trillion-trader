package com.trillion.trader.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class PropFirmResponse {
    private String id;
    private String name;
    private String logoUrl;
    private String websiteUrl;
    private String referralLink;
    private double rating;
    private String maxFunding;
    private String profitSplit;
    private List<String> pros;
    private List<String> cons;
    private List<String> challengeTypes;
    private boolean recommended;
}
