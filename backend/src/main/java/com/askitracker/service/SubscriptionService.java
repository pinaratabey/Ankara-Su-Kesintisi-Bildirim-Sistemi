package com.askitracker.service;

import com.askitracker.dto.SubscriptionRequest;
import com.askitracker.dto.SubscriptionResponse;
import com.askitracker.entity.Neighborhood;
import com.askitracker.entity.Subscription;
import com.askitracker.repository.NeighborhoodRepository;
import com.askitracker.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubscriptionService {

    private final SubscriptionRepository subscriptionRepository;
    private final NeighborhoodRepository neighborhoodRepository;
    private final EmailService emailService;

    @Transactional
    public SubscriptionResponse createSubscription(SubscriptionRequest request) {
        // Check for duplicate
        if (subscriptionRepository.existsByEmailAndNeighborhoodIdAndIsActiveTrue(
                request.getEmail(), request.getNeighborhoodId())) {
            throw new IllegalArgumentException("This email is already subscribed to this location");
        }

        // Find neighborhood
        Neighborhood neighborhood = neighborhoodRepository.findById(request.getNeighborhoodId())
                .orElseThrow(() -> new IllegalArgumentException("Neighborhood not found"));

        // Create subscription
        Subscription subscription = new Subscription();
        subscription.setEmail(request.getEmail());
        subscription.setNeighborhood(neighborhood);
        subscription.setIsActive(true);
        subscription.setIsVerified(false);

        subscription = subscriptionRepository.save(subscription);
        log.info("Created subscription for email: {} in neighborhood: {}",
                request.getEmail(), neighborhood.getName());

        // Send confirmation email
        emailService.sendConfirmationEmail(subscription);

        return mapToResponse(subscription);
    }

    @Transactional
    public void unsubscribe(String token) {
        Subscription subscription = subscriptionRepository.findByUnsubscribeToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid unsubscribe token"));

        subscription.setIsActive(false);
        subscriptionRepository.save(subscription);
        log.info("Unsubscribed email: {}", subscription.getEmail());
    }

    @Transactional
    public void verifySubscription(String token) {
        Subscription subscription = subscriptionRepository.findByVerificationToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid verification token"));

        subscription.setIsVerified(true);
        subscriptionRepository.save(subscription);
        log.info("Verified subscription for email: {}", subscription.getEmail());
    }

    public List<Subscription> findActiveSubscriptionsByNeighborhoodIds(List<Long> neighborhoodIds) {
        return subscriptionRepository.findActiveVerifiedByNeighborhoodIds(neighborhoodIds);
    }

    public Long countActiveSubscriptions() {
        return subscriptionRepository.countActiveSubscriptions();
    }

    private SubscriptionResponse mapToResponse(Subscription subscription) {
        return SubscriptionResponse.builder()
                .id(subscription.getId())
                .email(subscription.getEmail())
                .neighborhoodId(subscription.getNeighborhood().getId())
                .neighborhoodName(subscription.getNeighborhood().getName())
                .districtName(subscription.getNeighborhood().getDistrict().getName())
                .isActive(subscription.getIsActive())
                .isVerified(subscription.getIsVerified())
                .createdAt(subscription.getCreatedAt())
                .build();
    }
}
