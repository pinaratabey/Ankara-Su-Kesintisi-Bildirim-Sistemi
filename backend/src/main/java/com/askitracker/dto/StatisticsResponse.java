package com.askitracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatisticsResponse {
    private Long totalOutages;
    private Long totalActiveSubscriptions;
    private Long outagesLast30Days;
    private Long outagesLast7Days;
    private List<DistrictStats> outagesByDistrict;
    private List<MonthlyStats> monthlyTrend;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DistrictStats {
        private String districtName;
        private Long outageCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthlyStats {
        private String month;
        private Long outageCount;
    }
}
