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
@Document(collection = "resources")
public class Resource extends BaseEntity {
    @Id
    private String id;
    
    private String title;
    private String description;
    private String fileUrl;
    private String coverImageUrl;
    
    private String type; // e.g., PDF, CHEATSHEET, INDICATOR
    private boolean isFree;
}
