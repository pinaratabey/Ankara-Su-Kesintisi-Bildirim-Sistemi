package com.askitracker.repository;

import com.askitracker.entity.OutageLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OutageLocationRepository extends JpaRepository<OutageLocation, Long> {
    List<OutageLocation> findByOutageId(Long outageId);

    List<OutageLocation> findByNeighborhoodId(Long neighborhoodId);
}
