package com.askitracker.service;

import com.askitracker.dto.OutageResponse;
import com.askitracker.entity.Outage;
import com.askitracker.entity.OutageLocation;
import com.askitracker.entity.Subscription;
import com.askitracker.repository.OutageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OutageService {

    private final OutageRepository outageRepository;
    private final SubscriptionService subscriptionService;
    private final EmailService emailService;

    public Page<OutageResponse> getAllOutages(Pageable pageable) {
        return outageRepository.findAllByOrderByPublishedAtDesc(pageable)
                .map(this::mapToResponse);
    }

    public OutageResponse getOutageById(Long id) {
        Outage outage = outageRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Outage not found"));
        return mapToResponse(outage);
    }

    public List<OutageResponse> getRecentOutages() {
        return outageRepository.findTop10ByOrderByPublishedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Page<OutageResponse> getOutagesByDistrict(Long districtId, Pageable pageable) {
        return outageRepository.findByDistrictId(districtId, pageable)
                .map(this::mapToResponse);
    }

    public Page<OutageResponse> getOutagesByNeighborhood(Long neighborhoodId, Pageable pageable) {
        return outageRepository.findByNeighborhoodId(neighborhoodId, pageable)
                .map(this::mapToResponse);
    }

    @Transactional
    public void saveNewOutage(Outage outage) {
        // Check if outage already exists
        if (outageRepository.findByTitleAndPublishedAt(outage.getTitle(), outage.getPublishedAt()).isPresent()) {
            log.debug("Outage already exists: {}", outage.getTitle());
            return;
        }

        outageRepository.save(outage);
        log.info("Saved new outage: {}", outage.getTitle());
    }

    @Transactional
    public void processNewOutagesAndNotify() {
        List<Outage> unnotifiedOutages = outageRepository.findByNotificationsSentFalse();

        for (Outage outage : unnotifiedOutages) {
            try {
                sendNotificationsForOutage(outage);
                outage.setNotificationsSent(true);
                outageRepository.save(outage);
                log.info("Sent notifications for outage: {}", outage.getTitle());
            } catch (Exception e) {
                log.error("Error sending notifications for outage: {}", outage.getTitle(), e);
            }
        }
    }

    private void sendNotificationsForOutage(Outage outage) {
        List<Long> affectedNeighborhoodIds = outage.getOutageLocations().stream()
                .map(ol -> ol.getNeighborhood().getId())
                .collect(Collectors.toList());

        if (affectedNeighborhoodIds.isEmpty()) {
            return;
        }

        List<Subscription> affectedSubscriptions = subscriptionService
                .findActiveSubscriptionsByNeighborhoodIds(affectedNeighborhoodIds);

        for (Subscription subscription : affectedSubscriptions) {
            emailService.sendOutageNotification(subscription, outage);
        }

        log.info("Sent {} notifications for outage: {}",
                affectedSubscriptions.size(), outage.getTitle());
    }

    public Long countOutagesSince(LocalDateTime since) {
        return outageRepository.countOutagesSince(since);
    }

    public Long countTotalOutages() {
        return outageRepository.count();
    }

    private OutageResponse mapToResponse(Outage outage) {
        List<OutageResponse.LocationInfo> locations = outage.getOutageLocations().stream()
                .map(ol -> OutageResponse.LocationInfo.builder()
                        .neighborhoodId(ol.getNeighborhood().getId())
                        .neighborhoodName(ol.getNeighborhood().getName())
                        .districtName(ol.getNeighborhood().getDistrict().getName())
                        .build())
                .collect(Collectors.toList());

        return OutageResponse.builder()
                .id(outage.getId())
                .title(outage.getTitle())
                .description(outage.getDescription())
                .startTime(outage.getStartTime())
                .endTime(outage.getEndTime())
                .publishedAt(outage.getPublishedAt())
                .sourceUrl(outage.getSourceUrl())
                .affectedLocations(locations)
                .build();
    }
}
