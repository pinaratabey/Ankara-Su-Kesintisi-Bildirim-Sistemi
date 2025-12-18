package com.askitracker.repository;

import com.askitracker.entity.Outage;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OutageRepository extends JpaRepository<Outage, Long> {

    Page<Outage> findAllByOrderByPublishedAtDesc(Pageable pageable);

    List<Outage> findTop10ByOrderByPublishedAtDesc();

    Optional<Outage> findByTitleAndPublishedAt(String title, LocalDateTime publishedAt);

    List<Outage> findByNotificationsSentFalse();

    @Query("SELECT o FROM Outage o WHERE o.publishedAt BETWEEN :startDate AND :endDate ORDER BY o.publishedAt DESC")
    List<Outage> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT o FROM Outage o JOIN o.outageLocations ol JOIN ol.neighborhood n WHERE n.district.id = :districtId ORDER BY o.publishedAt DESC")
    Page<Outage> findByDistrictId(@Param("districtId") Long districtId, Pageable pageable);

    @Query("SELECT o FROM Outage o JOIN o.outageLocations ol WHERE ol.neighborhood.id = :neighborhoodId ORDER BY o.publishedAt DESC")
    Page<Outage> findByNeighborhoodId(@Param("neighborhoodId") Long neighborhoodId, Pageable pageable);

    @Query("SELECT COUNT(o) FROM Outage o WHERE o.publishedAt >= :since")
    Long countOutagesSince(@Param("since") LocalDateTime since);
}
