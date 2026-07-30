package com.trillion.trader.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class BrokerRequest {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    private String logoUrl;
    
    @NotBlank(message = "Website URL is required")
    private String websiteUrl;
    
    private String referralLink;
    private double rating;
    private String minDeposit;
    private String maxLeverage;
    
    private List<String> pros;
    private List<String> cons;
    private List<String> supportedPlatforms;
    
    private boolean recommended;
}
