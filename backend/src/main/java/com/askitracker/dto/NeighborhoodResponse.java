package com.askitracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NeighborhoodResponse {
    private Long id;
    private String name;
    private Long districtId;
    private String districtName;
}
