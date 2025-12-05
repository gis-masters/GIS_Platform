package ru.mycrg.auth_service.service.organization;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_service.entity.OrgInitOutbox;
import ru.mycrg.auth_service.entity.Organization;
import ru.mycrg.auth_service.entity.User;
import ru.mycrg.auth_service.queue.MessageBusProducer;
import ru.mycrg.auth_service.repository.OrgInitOutboxRepository;
import ru.mycrg.auth_service.repository.OrganizationRepository;
import ru.mycrg.auth_service.service.AuthService;
import ru.mycrg.auth_service_contract.AESCryptor;
import ru.mycrg.auth_service_contract.events.request.OrganizationInitializedEvent;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.Optional;

import static java.time.LocalDateTime.now;
import static ru.mycrg.auth_service.entity.OutboxStatus.PROCESSED;
import static ru.mycrg.auth_service.service.organization.OrgInitOutboxReregistrationService.BASE_DEADLINE_DURATION;
import static ru.mycrg.common_utils.CrgGlobalProperties.prepareGeoserverLogin;

/**
 * Сервис для обработки записей из org_init_outbox. Периодически проверяет наличие необработанных событий инициализации
 * организации и отправляет их в очередь сообщений. Поддерживает как автоматическую обработку по расписанию, так и
 * ручной запуск через API.
 */
@Service
public class OrgInitOutboxScheduler {

    private final Logger log = LoggerFactory.getLogger(OrgInitOutboxScheduler.class);

    private final AESCryptor aesCryptor;
    private final AuthService authService;
    private final MessageBusProducer messageBusProducer;
    private final OrgInitOutboxRepository outboxRepository;
    private final OrganizationRepository organizationRepository;
    private final OrgInitOutboxReregistrationService reregistrationService;

    private static final int MAX_RETRY_COUNT = 3;

    public OrgInitOutboxScheduler(OrgInitOutboxRepository outboxRepository,
                                  OrganizationRepository organizationRepository,
                                  AuthService authService,
                                  MessageBusProducer messageBusProducer,
                                  AESCryptor aesCryptor,
                                  OrgInitOutboxReregistrationService reregistrationService) {
        this.aesCryptor = aesCryptor;
        this.authService = authService;
        this.outboxRepository = outboxRepository;
        this.messageBusProducer = messageBusProducer;
        this.reregistrationService = reregistrationService;
        this.organizationRepository = organizationRepository;
    }

    @Transactional
    @Scheduled(fixedDelayString = "PT30S")
    public void processPendingOutboxEventsScheduled() {
        processOutboxEvents();
    }

    /**
     * Обрабатывает одну запись из outbox со статусом PENDING. Обрабатывает строго по одной записи за раз, выбирая самую
     * старую по времени создания. Не начинает новую обработку, если есть записи со статусом PROCESSED. Также проверяет
     * зависшие события (PROCESSED с истекшим deadline) и перерегистрирует их.
     */
    @Transactional
    public void processOutboxEvents() {
        log.debug("Запуск обработки запросов на создание организаций из 'org_init_outbox'");

        try {
            outboxRepository.findStuckProcessedEvents()
                            .forEach(reregistrationService::reRegisterEvent);

            if (outboxRepository.existsByStatus(PROCESSED)) {
                log.debug("Идет создание организации. Не начинаем новую обработку.");

                return;
            }

            Optional<OrgInitOutbox> oldestPending = outboxRepository.findOldestPending();
            if (oldestPending.isEmpty()) {
                log.debug("Запросов на создание организаций нет. Мы все создали - мы молодцы!");

                return;
            }

            OrgInitOutbox pendingEvent = oldestPending.get();
            log.debug("Найден запрос на создание организации: orgId: {}, createdAt: '{}'",
                      pendingEvent.getOrgId(), pendingEvent.getCreatedAt());

            processOutboxEvent(pendingEvent);

            log.debug("Завершена обработка запросов на создание организаций");
        } catch (Exception e) {
            log.error("Не удалось запустить обработку запросов на создание организаций => {}", e.getMessage(), e);
        }
    }

    /**
     * Обрабатывает одну запись из outbox.
     *
     * @param outbox запись для обработки
     */
    private void processOutboxEvent(OrgInitOutbox outbox) {
        Long orgId = outbox.getOrgId();

        log.debug("Обработка запроса на создание организации: orgId={}", orgId);
        try {
            Organization organization = organizationRepository
                    .findById(orgId)
                    .orElseThrow(() -> new EntityNotFoundException("Организация не найдена: " + orgId));

            User owner = organization
                    .getUsers().stream()
                    .findFirst()
                    .orElseThrow(() -> new EntityNotFoundException("Владелец не найден для организации: " + orgId));

            String encryptedPassword = outbox.getEncryptedPassword();
            String rootToken = authService.getRootAccessToken();
            String ownerToken = authService.authorize(owner.getEmail(), aesCryptor.decrypt(encryptedPassword))
                                           .getAccess_token();

            // Создаем событие
            OrganizationInitializedEvent event = new OrganizationInitializedEvent(
                    orgId,
                    rootToken,
                    ownerToken,
                    encryptedPassword,
                    owner.getEmail(),
                    owner.getEmail(),
                    prepareGeoserverLogin(owner.getEmail(), owner.getId()),
                    outbox.getSpecializationId());

            // Отправляем событие в очередь
            messageBusProducer.produce(event);

            // Обновляем статус на PROCESSED и устанавливаем deadline (текущее время + 10 минут)
            LocalDateTime deadline = now().plus(BASE_DEADLINE_DURATION);
            outboxRepository.markAsProcessed(orgId, deadline);

            log.info("Запрос на создание организации успешно обработан: orgId={}, deadline={}", orgId, deadline);
        } catch (Exception e) {
            log.error("Ошибка при обработке запроса на создание организации: orgId={}", orgId, e);

            outboxRepository.incrementRetryCount(orgId);

            OrgInitOutbox outboxEvent = outboxRepository
                    .findByOrgId(orgId)
                    .orElseThrow(() -> new EntityNotFoundException("Запись outbox не найдена: " + orgId));
            if (outboxEvent.getRetryCount() >= MAX_RETRY_COUNT) {
                outboxRepository.markAsFailed(orgId);
                log.warn("Превышено максимальное количество попыток для создания организации: orgId={}, retryCount={}",
                         orgId, outboxEvent.getRetryCount());
            }

            throw new RuntimeException("Не удалось обработать запрос на создание организации", e);
        }
    }
}

