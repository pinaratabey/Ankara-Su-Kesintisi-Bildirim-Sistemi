package com.askitracker.controller;

import com.askitracker.dto.ApiResponse;
import com.askitracker.dto.DistrictResponse;
import com.askitracker.dto.NeighborhoodResponse;
import com.askitracker.service.LocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LocationController {

    private final LocationService locationService;

    @GetMapping("/districts")
    public ResponseEntity<ApiResponse<List<DistrictResponse>>> getAllDistricts() {
        List<DistrictResponse> districts = locationService.getAllDistricts();
        return ResponseEntity.ok(ApiResponse.success(districts));
    }

    @GetMapping("/neighborhoods")
    public ResponseEntity<ApiResponse<List<NeighborhoodResponse>>> getNeighborhoodsByDistrict(
            @RequestParam Long districtId) {
        List<NeighborhoodResponse> neighborhoods = locationService.getNeighborhoodsByDistrict(districtId);
        return ResponseEntity.ok(ApiResponse.success(neighborhoods));
    }

    @GetMapping("/neighborhoods/search")
    public ResponseEntity<ApiResponse<List<NeighborhoodResponse>>> searchNeighborhoods(
            @RequestParam String query) {
        List<NeighborhoodResponse> neighborhoods = locationService.searchNeighborhoods(query);
        return ResponseEntity.ok(ApiResponse.success(neighborhoods));
    }
}
