package com.trillion.trader.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class WebsiteSettingRequest {
    
    @NotBlank(message = "Key is required")
    private String key;
    
    @NotBlank(message = "Value is required")
    private String value;
    
    private String description;
}
