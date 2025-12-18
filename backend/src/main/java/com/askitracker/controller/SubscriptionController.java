package com.askitracker.controller;

import com.askitracker.dto.ApiResponse;
import com.askitracker.dto.SubscriptionRequest;
import com.askitracker.dto.SubscriptionResponse;
import com.askitracker.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<ApiResponse<SubscriptionResponse>> createSubscription(
            @Valid @RequestBody SubscriptionRequest request) {
        try {
            SubscriptionResponse response = subscriptionService.createSubscription(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success(response,
                            "Subscription created successfully. Please check your email to verify."));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("DUPLICATE_SUBSCRIPTION", e.getMessage()));
        }
    }

    @DeleteMapping("/{token}")
    public ResponseEntity<ApiResponse<Void>> unsubscribe(@PathVariable String token) {
        try {
            subscriptionService.unsubscribe(token);
            return ResponseEntity.ok(ApiResponse.success(null, "Successfully unsubscribed"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("INVALID_TOKEN", e.getMessage()));
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<ApiResponse<Void>> verifySubscription(@RequestParam String token) {
        try {
            subscriptionService.verifySubscription(token);
            return ResponseEntity.ok(ApiResponse.success(null, "Email verified successfully"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("INVALID_TOKEN", e.getMessage()));
        }
    }
}
