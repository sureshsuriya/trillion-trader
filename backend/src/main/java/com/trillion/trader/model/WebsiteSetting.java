package com.trillion.trader.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Document(collection = "website_settings")
public class WebsiteSetting extends BaseEntity {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String key; // e.g., "maintenance_mode", "hero_banner_text"
    
    private String value;
    private String description;
}
