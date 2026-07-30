package com.trillion.trader.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Document(collection = "prop_firms")
public class PropFirm extends BaseEntity {
    @Id
    private String id;
    
    private String name;
    private String logoUrl;
    private String websiteUrl;
    private String referralLink;
    
    private double rating;
    private String maxFunding;
    private String profitSplit;
    
    private List<String> pros;
    private List<String> cons;
    private List<String> challengeTypes;
    
    private boolean recommended;
}
