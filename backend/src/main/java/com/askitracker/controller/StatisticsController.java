package com.askitracker.controller;

import com.askitracker.dto.ApiResponse;
import com.askitracker.dto.StatisticsResponse;
import com.askitracker.service.StatisticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping
    public ResponseEntity<ApiResponse<StatisticsResponse>> getStatistics() {
        StatisticsResponse statistics = statisticsService.getStatistics();
        return ResponseEntity.ok(ApiResponse.success(statistics));
    }
}
