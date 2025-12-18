package com.askitracker.service;

import com.askitracker.dto.DistrictResponse;
import com.askitracker.dto.NeighborhoodResponse;
import com.askitracker.entity.District;
import com.askitracker.entity.Neighborhood;
import com.askitracker.repository.DistrictRepository;
import com.askitracker.repository.NeighborhoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LocationService {

    private final DistrictRepository districtRepository;
    private final NeighborhoodRepository neighborhoodRepository;

    public List<DistrictResponse> getAllDistricts() {
        return districtRepository.findAll().stream()
                .map(this::mapDistrictToResponse)
                .collect(Collectors.toList());
    }

    public List<NeighborhoodResponse> getNeighborhoodsByDistrict(Long districtId) {
        return neighborhoodRepository.findByDistrictId(districtId).stream()
                .map(this::mapNeighborhoodToResponse)
                .collect(Collectors.toList());
    }

    public List<NeighborhoodResponse> searchNeighborhoods(String query) {
        return neighborhoodRepository.findByNameContainingIgnoreCase(query).stream()
                .map(this::mapNeighborhoodToResponse)
                .collect(Collectors.toList());
    }

    private DistrictResponse mapDistrictToResponse(District district) {
        return DistrictResponse.builder()
                .id(district.getId())
                .name(district.getName())
                .code(district.getCode())
                .neighborhoodCount(district.getNeighborhoods().size())
                .build();
    }

    private NeighborhoodResponse mapNeighborhoodToResponse(Neighborhood neighborhood) {
        return NeighborhoodResponse.builder()
                .id(neighborhood.getId())
                .name(neighborhood.getName())
                .districtId(neighborhood.getDistrict().getId())
                .districtName(neighborhood.getDistrict().getName())
                .build();
    }
}
