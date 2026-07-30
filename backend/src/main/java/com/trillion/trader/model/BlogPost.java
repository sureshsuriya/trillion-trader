package com.trillion.trader.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Document(collection = "blog_posts")
public class BlogPost extends BaseEntity {
    @Id
    private String id;
    
    private String title;
    
    @Indexed(unique = true)
    private String slug;
    
    private String content;
    private String excerpt;
    private String coverImageUrl;
    
    private String authorId;
    private String categoryId;
    private List<String> tags;
    
    private boolean published;
    private int views;
}
