package com.trillion.trader.service;

import com.trillion.trader.dto.PagedResponse;
import com.trillion.trader.dto.request.ResourceRequest;
import com.trillion.trader.dto.response.ResourceResponse;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ResourceService {
    PagedResponse<ResourceResponse> getAllResources(Pageable pageable, String type);
    ResourceResponse getResourceById(String id);
    ResourceResponse createResource(ResourceRequest request);
    ResourceResponse updateResource(String id, ResourceRequest request);
    void deleteResource(String id);
}
