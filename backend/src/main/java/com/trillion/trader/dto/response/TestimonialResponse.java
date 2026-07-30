package com.trillion.trader.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TestimonialResponse {
    private String id;
    private String authorName;
    private String authorRole;
    private String avatarUrl;
    private String content;
    private int rating;
    private boolean featured;
}
