package com.askitracker.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionResponse {
    private Long id;
    private String email;
    private Long neighborhoodId;
    private String neighborhoodName;
    private String districtName;
    private Boolean isActive;
    private Boolean isVerified;
    private LocalDateTime createdAt;
}
