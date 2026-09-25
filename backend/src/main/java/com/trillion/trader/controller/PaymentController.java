package com.trillion.trader.controller;

import com.trillion.trader.dto.ApiResponse;
import com.trillion.trader.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create-checkout-session")
    public ResponseEntity<ApiResponse<Map<String, String>>> createCheckoutSession(
            @RequestBody Map<String, String> request) {
        try {
            String planType = request.getOrDefault("planType", "MONTHLY");
            String email = request.getOrDefault("email", "trader@example.com");
            Map<String, String> sessionData = paymentService.createCheckoutSession(planType, email);
            return ResponseEntity.ok(ApiResponse.success(sessionData, "Stripe Checkout session created"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Failed to create Stripe Checkout session: " + e.getMessage()));
        }
    }
}
