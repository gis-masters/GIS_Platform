package ru.mycrg.auth_service.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import ru.mycrg.auth_service.entity.OrgInitOutbox;
import ru.mycrg.auth_service.entity.OutboxStatus;

import java.util.Optional;

@Repository
public interface OrgInitOutboxRepository extends CrudRepository<OrgInitOutbox, Long> {

    @Query(value = "SELECT * FROM org_init_outbox WHERE status = 0 ORDER BY created_at LIMIT 1", nativeQuery = true)
    Optional<OrgInitOutbox> findOldestPending();

    boolean existsByStatus(OutboxStatus status);

    Optional<OrgInitOutbox> findByOrgId(Long orgId);

    @Modifying
    @Query("UPDATE OrgInitOutbox o SET o.status = 1, o.processedAt = CURRENT_TIMESTAMP, o.deadline = :deadline WHERE o.orgId = :orgId")
    void markAsProcessed(@Param("orgId") Long orgId, @Param("deadline") java.time.LocalDateTime deadline);

    @Modifying
    @Query("UPDATE OrgInitOutbox o SET o.retryCount = o.retryCount + 1 WHERE o.orgId = :orgId")
    void incrementRetryCount(@Param("orgId") Long orgId);

    @Modifying
    @Query("UPDATE OrgInitOutbox o SET o.status = 2, o.processedAt = CURRENT_TIMESTAMP WHERE o.orgId = :orgId")
    void markAsFailed(@Param("orgId") Long orgId);

    @Query("SELECT o FROM OrgInitOutbox o WHERE o.status = 1 AND o.deadline < CURRENT_TIMESTAMP")
    java.util.List<OrgInitOutbox> findStuckProcessedEvents();
}
