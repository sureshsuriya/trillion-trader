package com.trillion.trader.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ResourceRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotBlank(message = "File URL is required")
    private String fileUrl;
    
    private String coverImageUrl;
    
    @NotBlank(message = "Type is required")
    private String type; // e.g., PDF, CHEATSHEET, INDICATOR
    
    private boolean isFree;
}
