package com.trillion.trader.service.impl;

import com.trillion.trader.dto.PagedResponse;
import com.trillion.trader.dto.request.BrokerRequest;
import com.trillion.trader.dto.response.BrokerResponse;
import com.trillion.trader.exception.ResourceNotFoundException;
import com.trillion.trader.model.Broker;
import com.trillion.trader.repository.BrokerRepository;
import com.trillion.trader.service.BrokerService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BrokerServiceImpl implements BrokerService {

    private final BrokerRepository repository;

    @Override
    public PagedResponse<BrokerResponse> getAllBrokers(Pageable pageable) {
        Page<Broker> page = repository.findAll(pageable);
        return PagedResponse.of(page.map(this::mapToResponse));
    }

    @Override
    public List<BrokerResponse> getRecommendedBrokers() {
        return repository.findByRecommendedTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BrokerResponse getBrokerById(String id) {
        return mapToResponse(findOrThrow(id));
    }

    @Override
    public BrokerResponse createBroker(BrokerRequest request) {
        Broker broker = Broker.builder()
                .name(request.getName())
                .logoUrl(request.getLogoUrl())
                .websiteUrl(request.getWebsiteUrl())
                .referralLink(request.getReferralLink())
                .rating(request.getRating())
                .minDeposit(request.getMinDeposit())
                .maxLeverage(request.getMaxLeverage())
                .pros(request.getPros())
                .cons(request.getCons())
                .supportedPlatforms(request.getSupportedPlatforms())
                .recommended(request.isRecommended())
                .build();
        return mapToResponse(repository.save(broker));
    }

    @Override
    public BrokerResponse updateBroker(String id, BrokerRequest request) {
        Broker broker = findOrThrow(id);
        
        broker.setName(request.getName());
        broker.setLogoUrl(request.getLogoUrl());
        broker.setWebsiteUrl(request.getWebsiteUrl());
        broker.setReferralLink(request.getReferralLink());
        broker.setRating(request.getRating());
        broker.setMinDeposit(request.getMinDeposit());
        broker.setMaxLeverage(request.getMaxLeverage());
        broker.setPros(request.getPros());
        broker.setCons(request.getCons());
        broker.setSupportedPlatforms(request.getSupportedPlatforms());
        broker.setRecommended(request.isRecommended());
        
        return mapToResponse(repository.save(broker));
    }

    @Override
    public void deleteBroker(String id) {
        repository.delete(findOrThrow(id));
    }

    private Broker findOrThrow(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Broker not found with id: " + id));
    }

    private BrokerResponse mapToResponse(Broker broker) {
        return BrokerResponse.builder()
                .id(broker.getId())
                .name(broker.getName())
                .logoUrl(broker.getLogoUrl())
                .websiteUrl(broker.getWebsiteUrl())
                .referralLink(broker.getReferralLink())
                .rating(broker.getRating())
                .minDeposit(broker.getMinDeposit())
                .maxLeverage(broker.getMaxLeverage())
                .pros(broker.getPros())
                .cons(broker.getCons())
                .supportedPlatforms(broker.getSupportedPlatforms())
                .recommended(broker.isRecommended())
                .build();
    }
}
