package com.trillion.trader.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FAQResponse {
    private String id;
    private String question;
    private String answer;
    private String category;
    private int displayOrder;
}
