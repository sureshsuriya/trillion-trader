package com.trillion.trader.controller;

import com.trillion.trader.dto.ApiResponse;
import com.trillion.trader.model.NewsletterSubscriber;
import com.trillion.trader.service.NewsletterSubscriberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/newsletter")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Update in prod
public class NewsletterController {

    private final NewsletterSubscriberService service;

    @PostMapping("/subscribe")
    public ResponseEntity<ApiResponse<NewsletterSubscriber>> subscribe(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Email is required"));
        }
        NewsletterSubscriber subscriber = service.subscribe(email);
        return ResponseEntity.ok(ApiResponse.success(subscriber, "Subscribed successfully"));
    }

    @PostMapping("/unsubscribe")
    public ResponseEntity<ApiResponse<Void>> unsubscribe(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        if (email != null && !email.isBlank()) {
            service.unsubscribe(email);
        }
        return ResponseEntity.ok(ApiResponse.success(null, "Unsubscribed successfully"));
    }

    // Admin endpoints
    @GetMapping
    public ResponseEntity<ApiResponse<List<NewsletterSubscriber>>> getActiveSubscribers() {
        return ResponseEntity.ok(ApiResponse.success(service.getAllActiveSubscribers(), "Subscribers retrieved"));
    }
}
