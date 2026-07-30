package com.trillion.trader.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Document(collection = "testimonials")
public class Testimonial extends BaseEntity {
    @Id
    private String id;
    
    private String authorName;
    private String authorRole; // e.g., "Funded Trader"
    private String avatarUrl;
    
    private String content;
    private int rating; // 1-5
    
    private boolean featured;
}
