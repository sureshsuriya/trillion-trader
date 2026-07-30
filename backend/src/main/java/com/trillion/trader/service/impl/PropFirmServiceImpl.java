package com.trillion.trader.service.impl;

import com.trillion.trader.dto.PagedResponse;
import com.trillion.trader.dto.request.PropFirmRequest;
import com.trillion.trader.dto.response.PropFirmResponse;
import com.trillion.trader.exception.ResourceNotFoundException;
import com.trillion.trader.model.PropFirm;
import com.trillion.trader.repository.PropFirmRepository;
import com.trillion.trader.service.PropFirmService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PropFirmServiceImpl implements PropFirmService {

    private final PropFirmRepository repository;

    @Override
    public PagedResponse<PropFirmResponse> getAllPropFirms(Pageable pageable) {
        Page<PropFirm> page = repository.findAll(pageable);
        return PagedResponse.of(page.map(this::mapToResponse));
    }

    @Override
    public List<PropFirmResponse> getRecommendedPropFirms() {
        return repository.findByRecommendedTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public PropFirmResponse getPropFirmById(String id) {
        return mapToResponse(findOrThrow(id));
    }

    @Override
    public PropFirmResponse createPropFirm(PropFirmRequest request) {
        PropFirm propFirm = PropFirm.builder()
                .name(request.getName())
                .logoUrl(request.getLogoUrl())
                .websiteUrl(request.getWebsiteUrl())
                .referralLink(request.getReferralLink())
                .rating(request.getRating())
                .maxFunding(request.getMaxFunding())
                .profitSplit(request.getProfitSplit())
                .pros(request.getPros())
                .cons(request.getCons())
                .challengeTypes(request.getChallengeTypes())
                .recommended(request.isRecommended())
                .build();
        return mapToResponse(repository.save(propFirm));
    }

    @Override
    public PropFirmResponse updatePropFirm(String id, PropFirmRequest request) {
        PropFirm propFirm = findOrThrow(id);
        
        propFirm.setName(request.getName());
        propFirm.setLogoUrl(request.getLogoUrl());
        propFirm.setWebsiteUrl(request.getWebsiteUrl());
        propFirm.setReferralLink(request.getReferralLink());
        propFirm.setRating(request.getRating());
        propFirm.setMaxFunding(request.getMaxFunding());
        propFirm.setProfitSplit(request.getProfitSplit());
        propFirm.setPros(request.getPros());
        propFirm.setCons(request.getCons());
        propFirm.setChallengeTypes(request.getChallengeTypes());
        propFirm.setRecommended(request.isRecommended());
        
        return mapToResponse(repository.save(propFirm));
    }

    @Override
    public void deletePropFirm(String id) {
        repository.delete(findOrThrow(id));
    }

    private PropFirm findOrThrow(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prop Firm not found with id: " + id));
    }

    private PropFirmResponse mapToResponse(PropFirm propFirm) {
        return PropFirmResponse.builder()
                .id(propFirm.getId())
                .name(propFirm.getName())
                .logoUrl(propFirm.getLogoUrl())
                .websiteUrl(propFirm.getWebsiteUrl())
                .referralLink(propFirm.getReferralLink())
                .rating(propFirm.getRating())
                .maxFunding(propFirm.getMaxFunding())
                .profitSplit(propFirm.getProfitSplit())
                .pros(propFirm.getPros())
                .cons(propFirm.getCons())
                .challengeTypes(propFirm.getChallengeTypes())
                .recommended(propFirm.isRecommended())
                .build();
    }
}
