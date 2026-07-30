package com.trillion.trader.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class BlogPostResponse {
    private String id;
    private String title;
    private String slug;
    private String content;
    private String excerpt;
    private String coverImageUrl;
    private String authorId;
    private BlogCategoryResponse category; // Nested DTO
    private List<String> tags;
    private boolean published;
    private int views;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
