package com.askitracker.repository;

import com.askitracker.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    Optional<Subscription> findByUnsubscribeToken(String token);

    Optional<Subscription> findByVerificationToken(String token);

    Optional<Subscription> findByEmailAndNeighborhoodId(String email, Long neighborhoodId);

    List<Subscription> findByNeighborhoodIdAndIsActiveTrue(Long neighborhoodId);

    @Query("SELECT s FROM Subscription s WHERE s.neighborhood.id IN :neighborhoodIds AND s.isActive = true AND s.isVerified = true")
    List<Subscription> findActiveVerifiedByNeighborhoodIds(@Param("neighborhoodIds") List<Long> neighborhoodIds);

    @Query("SELECT COUNT(s) FROM Subscription s WHERE s.isActive = true")
    Long countActiveSubscriptions();

    List<Subscription> findByEmail(String email);

    boolean existsByEmailAndNeighborhoodIdAndIsActiveTrue(String email, Long neighborhoodId);
}
