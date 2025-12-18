package com.askitracker.repository;

import com.askitracker.entity.Neighborhood;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NeighborhoodRepository extends JpaRepository<Neighborhood, Long> {
    List<Neighborhood> findByDistrictId(Long districtId);

    Optional<Neighborhood> findByNameAndDistrictId(String name, Long districtId);

    List<Neighborhood> findByNameContainingIgnoreCase(String name);
}
