package com.askitracker.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import lombok.EqualsAndHashCode;

@Entity
@Table(name = "outage_locations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OutageLocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "outage_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Outage outage;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "neighborhood_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Neighborhood neighborhood;
}
