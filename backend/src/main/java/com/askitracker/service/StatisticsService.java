package com.askitracker.service;

import com.askitracker.dto.StatisticsResponse;
import com.askitracker.repository.OutageRepository;
import com.askitracker.repository.SubscriptionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private final OutageRepository outageRepository;
    private final SubscriptionRepository subscriptionRepository;

    public StatisticsResponse getStatistics() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime last7Days = now.minusDays(7);
        LocalDateTime last30Days = now.minusDays(30);

        return StatisticsResponse.builder()
                .totalOutages(outageRepository.count())
                .totalActiveSubscriptions(subscriptionRepository.countActiveSubscriptions())
                .outagesLast7Days(outageRepository.countOutagesSince(last7Days))
                .outagesLast30Days(outageRepository.countOutagesSince(last30Days))
                .outagesByDistrict(getOutagesByDistrict())
                .monthlyTrend(getMonthlyTrend())
                .build();
    }

    private List<StatisticsResponse.DistrictStats> getOutagesByDistrict() {
        // This would typically be a native query or aggregation
        // Simplified implementation for now
        return new ArrayList<>();
    }

    private List<StatisticsResponse.MonthlyStats> getMonthlyTrend() {
        // This would typically be a native query or aggregation
        // Simplified implementation for now
        return new ArrayList<>();
    }
}
