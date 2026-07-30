package com.trillion.trader.service;

import com.trillion.trader.model.NewsletterSubscriber;
import com.trillion.trader.repository.NewsletterSubscriberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NewsletterSubscriberService {
    
    private final NewsletterSubscriberRepository repository;
    
    public NewsletterSubscriber subscribe(String email) {
        if (repository.existsByEmail(email)) {
            // Already subscribed, just ensure it's active
            NewsletterSubscriber existing = repository.findByEmail(email).get();
            if (!existing.isActive()) {
                existing.setActive(true);
                return repository.save(existing);
            }
            return existing;
        }
        
        NewsletterSubscriber subscriber = NewsletterSubscriber.builder()
                .email(email)
                .active(true)
                .build();
                
        return repository.save(subscriber);
    }
    
    public void unsubscribe(String email) {
        repository.findByEmail(email).ifPresent(subscriber -> {
            subscriber.setActive(false);
            repository.save(subscriber);
        });
    }
    
    public List<NewsletterSubscriber> getAllActiveSubscribers() {
        return repository.findAll().stream()
                .filter(NewsletterSubscriber::isActive)
                .toList();
    }
}
