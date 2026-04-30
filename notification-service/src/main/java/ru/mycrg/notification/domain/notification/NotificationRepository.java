package ru.mycrg.notification.domain.notification;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import ru.mycrg.notification.domain.notification.models.NotificationEntity;
import ru.mycrg.notification.domain.notification.models.NotificationStatus;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<NotificationEntity, Long> {

    Page<NotificationEntity> findByStatus(NotificationStatus status, Pageable pageable);

    @Query("SELECT n FROM NotificationEntity n " +
            "WHERE (n.status = 'PROCESSING' OR n.status = 'CREATED') " +
            "AND (n.lastAttemptAt < :time OR n.lastAttemptAt IS NULL) " +
            "AND n.attemptCount < n.strategyEntity.maxRetries")
    List<NotificationEntity> findNotificationsForRetry(LocalDateTime time);
}
