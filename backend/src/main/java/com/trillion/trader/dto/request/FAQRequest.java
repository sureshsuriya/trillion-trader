package com.trillion.trader.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FAQRequest {
    
    @NotBlank(message = "Question is required")
    private String question;
    
    @NotBlank(message = "Answer is required")
    private String answer;
    
    private String category;
    private int displayOrder;
}
