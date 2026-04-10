package ru.mycrg.auth_service.service.organization;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_service.entity.OrgInitOutbox;
import ru.mycrg.auth_service.repository.OrgInitOutboxRepository;

import java.time.Duration;
import java.time.LocalDateTime;

import static java.time.LocalDateTime.now;
import static ru.mycrg.auth_service.entity.OutboxStatus.PENDING;

/**
 * Сервис для перерегистрации событий создания организации в outbox. Используется при зависших событиях или ошибках
 * создания организации.
 */
@Service
public class OrgInitOutboxReregistrationService {

    private final Logger log = LoggerFactory.getLogger(OrgInitOutboxReregistrationService.class);

    private final OrgInitOutboxRepository outboxRepository;

    public static final Duration BASE_DEADLINE_DURATION = Duration.ofMinutes(1);

    public OrgInitOutboxReregistrationService(OrgInitOutboxRepository outboxRepository) {
        this.outboxRepository = outboxRepository;
    }

    /**
     * Перерегистрирует зависшее событие: обновляет запись с увеличенным счетчиком попыток и новым deadline.
     *
     * @param stuckEvent событие для перерегистрации
     */
    @Transactional
    public void reRegisterEvent(OrgInitOutbox stuckEvent) {
        Long orgId = stuckEvent.getOrgId();
        int currentRetryCount = stuckEvent.getRetryCount();
        int newRetryCount = currentRetryCount + 1;

        log.info("Перерегистрация события создания организации: orgId={}, текущий retryCount={}, новый retryCount={}",
                 orgId, currentRetryCount, newRetryCount);

        // Вычисляем новый deadline: (базовое время * 10) ^ retryCount
        Duration baseMultiplied = BASE_DEADLINE_DURATION.multipliedBy(10);
        long baseSeconds = baseMultiplied.getSeconds();
        long newDeadlineSeconds = (long) Math.pow(baseSeconds, newRetryCount);
        Duration newDeadlineDuration = Duration.ofSeconds(newDeadlineSeconds);
        LocalDateTime newDeadline = now().plus(newDeadlineDuration);

        // Обновляем существующую запись
        stuckEvent.setRetryCount(newRetryCount);
        stuckEvent.setStatus(PENDING);
        stuckEvent.setDeadline(newDeadline);
        stuckEvent.setProcessedAt(null);

        outboxRepository.save(stuckEvent);

        log.info("Событие перерегистрировано: orgId={}, новый retryCount={}, новый deadline={}",
                 orgId, newRetryCount, newDeadline);
    }
}

