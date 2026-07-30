package com.trillion.trader.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WebsiteSettingResponse {
    private String id;
    private String key;
    private String value;
    private String description;
}
