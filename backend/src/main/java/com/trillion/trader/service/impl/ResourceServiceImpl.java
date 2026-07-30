package com.trillion.trader.service.impl;

import com.trillion.trader.dto.PagedResponse;
import com.trillion.trader.dto.request.ResourceRequest;
import com.trillion.trader.dto.response.ResourceResponse;
import com.trillion.trader.exception.ResourceNotFoundException;
import com.trillion.trader.model.Resource;
import com.trillion.trader.repository.ResourceRepository;
import com.trillion.trader.service.ResourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ResourceServiceImpl implements ResourceService {

    private final ResourceRepository repository;

    @Override
    public PagedResponse<ResourceResponse> getAllResources(Pageable pageable, String type) {
        Page<Resource> page;
        if (type != null && !type.isBlank()) {
            List<Resource> filtered = repository.findByType(type);
            int start = (int) pageable.getOffset();
            int end = Math.min((start + pageable.getPageSize()), filtered.size());
            page = new PageImpl<>(filtered.subList(start, end), pageable, filtered.size());
        } else {
            page = repository.findAll(pageable);
        }
        return PagedResponse.of(page.map(this::mapToResponse));
    }

    @Override
    public ResourceResponse getResourceById(String id) {
        return mapToResponse(findOrThrow(id));
    }

    @Override
    public ResourceResponse createResource(ResourceRequest request) {
        Resource resource = Resource.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .fileUrl(request.getFileUrl())
                .coverImageUrl(request.getCoverImageUrl())
                .type(request.getType())
                .isFree(request.isFree())
                .build();
        return mapToResponse(repository.save(resource));
    }

    @Override
    public ResourceResponse updateResource(String id, ResourceRequest request) {
        Resource resource = findOrThrow(id);
        
        resource.setTitle(request.getTitle());
        resource.setDescription(request.getDescription());
        resource.setFileUrl(request.getFileUrl());
        resource.setCoverImageUrl(request.getCoverImageUrl());
        resource.setType(request.getType());
        resource.setFree(request.isFree());
        
        return mapToResponse(repository.save(resource));
    }

    @Override
    public void deleteResource(String id) {
        repository.delete(findOrThrow(id));
    }

    private Resource findOrThrow(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resource not found with id: " + id));
    }

    private ResourceResponse mapToResponse(Resource resource) {
        return ResourceResponse.builder()
                .id(resource.getId())
                .title(resource.getTitle())
                .description(resource.getDescription())
                .fileUrl(resource.getFileUrl())
                .coverImageUrl(resource.getCoverImageUrl())
                .type(resource.getType())
                .isFree(resource.isFree())
                .build();
    }
}
