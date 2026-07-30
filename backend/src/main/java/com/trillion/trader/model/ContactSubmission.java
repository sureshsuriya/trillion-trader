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
@Document(collection = "contact_submissions")
public class ContactSubmission extends BaseEntity {
    @Id
    private String id;
    
    private String name;
    private String email;
    private String subject;
    private String message;
    
    private boolean read;
}
