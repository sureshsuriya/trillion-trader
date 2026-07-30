package com.trillion.trader.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BlogCategoryRequest {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Slug is required")
    private String slug;
    
    private String description;
}
