package com.trillion.trader.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class PropFirmRequest {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    private String logoUrl;
    
    @NotBlank(message = "Website URL is required")
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
