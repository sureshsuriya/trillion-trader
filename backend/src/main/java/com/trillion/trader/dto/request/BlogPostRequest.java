package com.trillion.trader.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class BlogPostRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    @NotBlank(message = "Slug is required")
    private String slug;
    
    @NotBlank(message = "Content is required")
    private String content;
    
    private String excerpt;
    private String coverImageUrl;
    private String authorId;
    
    @NotBlank(message = "Category is required")
    private String categoryId;
    
    private List<String> tags;
    private boolean published;
}
