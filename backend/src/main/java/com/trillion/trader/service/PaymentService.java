package com.trillion.trader.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Slf4j
@Service
public class PaymentService {

    @Value("${stripe.api.key:sk_test_placeholder_key}")
    private String stripeApiKey;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    public Map<String, String> createCheckoutSession(String planType, String userEmail) throws StripeException {
        long amountInCents = 2900L; // Default Monthly $29
        String planName = "Pro Trader Monthly Subscription";

        if ("ANNUAL".equalsIgnoreCase(planType)) {
            amountInCents = 19900L; // Annual $199
            planName = "Pro Trader Annual Pass";
        } else if ("LIFETIME".equalsIgnoreCase(planType)) {
            amountInCents = 49900L; // Lifetime $499
            planName = "Pro Trader Lifetime Access";
        }

        SessionCreateParams params = SessionCreateParams.builder()
                .addPaymentMethodType(SessionCreateParams.PaymentMethodType.CARD)
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(frontendUrl + "/courses?payment=success&plan=" + planType)
                .setCancelUrl(frontendUrl + "/courses?payment=cancelled")
                .setCustomerEmail(userEmail != null && !userEmail.isEmpty() ? userEmail : "trader@example.com")
                .addLineItem(
                        SessionCreateParams.LineItem.builder()
                                .setQuantity(1L)
                                .setPriceData(
                                        SessionCreateParams.LineItem.PriceData.builder()
                                                .setCurrency("usd")
                                                .setUnitAmount(amountInCents)
                                                .setProductData(
                                                        SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                .setName(planName)
                                                                .setDescription("Unlimited access to all premium academy courses, video lessons, trade logs & Discord community.")
                                                                .build()
                                                )
                                                .build()
                                )
                                .build()
                )
                .build();

        Session session = Session.create(params);
        Map<String, String> response = new HashMap<>();
        response.put("checkoutUrl", session.getUrl());
        response.put("sessionId", session.getId());
        return response;
    }
}
