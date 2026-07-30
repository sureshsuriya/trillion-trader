package com.trillion.trader.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TestimonialRequest {
    
    @NotBlank(message = "Author name is required")
    private String authorName;
    
    private String authorRole;
    private String avatarUrl;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private int rating;
    
    private boolean featured;
}
