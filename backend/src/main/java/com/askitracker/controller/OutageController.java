package com.askitracker.controller;

import com.askitracker.dto.ApiResponse;
import com.askitracker.dto.OutageResponse;
import com.askitracker.service.OutageService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/outages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OutageController {

    private final OutageService outageService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<OutageResponse>>> getAllOutages(
            @PageableDefault(size = 10) Pageable pageable) {
        Page<OutageResponse> outages = outageService.getAllOutages(pageable);
        return ResponseEntity.ok(ApiResponse.success(outages));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OutageResponse>> getOutageById(@PathVariable Long id) {
        try {
            OutageResponse outage = outageService.getOutageById(id);
            return ResponseEntity.ok(ApiResponse.success(outage));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/recent")
    public ResponseEntity<ApiResponse<List<OutageResponse>>> getRecentOutages() {
        List<OutageResponse> outages = outageService.getRecentOutages();
        return ResponseEntity.ok(ApiResponse.success(outages));
    }

    @GetMapping("/by-district/{districtId}")
    public ResponseEntity<ApiResponse<Page<OutageResponse>>> getOutagesByDistrict(
            @PathVariable Long districtId,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<OutageResponse> outages = outageService.getOutagesByDistrict(districtId, pageable);
        return ResponseEntity.ok(ApiResponse.success(outages));
    }

    @GetMapping("/by-neighborhood/{neighborhoodId}")
    public ResponseEntity<ApiResponse<Page<OutageResponse>>> getOutagesByNeighborhood(
            @PathVariable Long neighborhoodId,
            @PageableDefault(size = 10) Pageable pageable) {
        Page<OutageResponse> outages = outageService.getOutagesByNeighborhood(neighborhoodId, pageable);
        return ResponseEntity.ok(ApiResponse.success(outages));
    }
}
