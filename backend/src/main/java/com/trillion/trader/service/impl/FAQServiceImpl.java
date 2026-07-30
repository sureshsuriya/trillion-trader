package com.trillion.trader.service.impl;

import com.trillion.trader.dto.PagedResponse;
import com.trillion.trader.dto.request.FAQRequest;
import com.trillion.trader.dto.response.FAQResponse;
import com.trillion.trader.exception.ResourceNotFoundException;
import com.trillion.trader.model.FAQ;
import com.trillion.trader.repository.FAQRepository;
import com.trillion.trader.service.FAQService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FAQServiceImpl implements FAQService {

    private final FAQRepository repository;

    @Override
    public PagedResponse<FAQResponse> getAllFAQs(Pageable pageable) {
        Page<FAQ> page = repository.findAll(pageable);
        return PagedResponse.of(page.map(this::mapToResponse));
    }

    @Override
    public List<FAQResponse> getFAQsByCategory(String category) {
        return repository.findByCategoryOrderByDisplayOrderAsc(category).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public FAQResponse getFAQById(String id) {
        return mapToResponse(findOrThrow(id));
    }

    @Override
    public FAQResponse createFAQ(FAQRequest request) {
        FAQ faq = FAQ.builder()
                .question(request.getQuestion())
                .answer(request.getAnswer())
                .category(request.getCategory())
                .displayOrder(request.getDisplayOrder())
                .build();
        return mapToResponse(repository.save(faq));
    }

    @Override
    public FAQResponse updateFAQ(String id, FAQRequest request) {
        FAQ faq = findOrThrow(id);
        
        faq.setQuestion(request.getQuestion());
        faq.setAnswer(request.getAnswer());
        faq.setCategory(request.getCategory());
        faq.setDisplayOrder(request.getDisplayOrder());
        
        return mapToResponse(repository.save(faq));
    }

    @Override
    public void deleteFAQ(String id) {
        repository.delete(findOrThrow(id));
    }

    private FAQ findOrThrow(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("FAQ not found with id: " + id));
    }

    private FAQResponse mapToResponse(FAQ faq) {
        return FAQResponse.builder()
                .id(faq.getId())
                .question(faq.getQuestion())
                .answer(faq.getAnswer())
                .category(faq.getCategory())
                .displayOrder(faq.getDisplayOrder())
                .build();
    }
}
