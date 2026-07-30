package com.trillion.trader.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ResourceResponse {
    private String id;
    private String title;
    private String description;
    private String fileUrl;
    private String coverImageUrl;
    private String type;
    private boolean isFree;
}
