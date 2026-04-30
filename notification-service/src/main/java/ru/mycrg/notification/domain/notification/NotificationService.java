package ru.mycrg.notification.domain.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.notification.domain.notification.dto.NotificationRequestDto;
import ru.mycrg.notification.domain.notification.dto.NotificationResponseDto;
import ru.mycrg.notification.domain.notification.models.NotificationEntity;
import ru.mycrg.notification.domain.notification.models.NotificationStatus;
import ru.mycrg.notification.domain.strategy.StrategyEntity;
import ru.mycrg.notification.domain.strategy.StrategyRepository;
import ru.mycrg.notification.domain.template.entity.TemplateEntity;
import ru.mycrg.notification.domain.template.repository.TemplateRepository;
import ru.mycrg.notification.exceptions.BadRequestException;
import ru.mycrg.notification.exceptions.NotFoundException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

import static java.time.LocalDateTime.now;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    private static final String DEFAULT_STRATEGY_NAME = "Стандартная";

    private final StrategyRepository strategyRepository;
    private final NotificationRepository notificationRepository;
    private final TemplateRepository templateRepository;
    private final ObjectMapper objectMapper;

    public NotificationService(NotificationRepository notificationRepository,
                               StrategyRepository strategyRepository,
                               TemplateRepository templateRepository,
                               ObjectMapper objectMapper) {
        this.notificationRepository = notificationRepository;
        this.strategyRepository = strategyRepository;
        this.templateRepository = templateRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public NotificationResponseDto createNotification(NotificationRequestDto requestDto) {
        String strategyName = requestDto.getStrategyName();

        // Если стратегия не указана, используем стратегию по умолчанию
        if (strategyName == null || strategyName.isEmpty()) {
            strategyName = DEFAULT_STRATEGY_NAME;
            log.info("Стратегия не указана, используем стратегию по умолчанию: {}", DEFAULT_STRATEGY_NAME);
        }

        String finalStrategyName = strategyName;
        StrategyEntity strategyEntity = strategyRepository
                .findByName(strategyName)
                .orElseThrow(() -> new BadRequestException("Стратегия с именем " + finalStrategyName + " не найдена"));

        // Получаем шаблон, если он указан
        TemplateEntity templateEntity = null;
        String templateName = requestDto.getTemplateName();
        if (templateName != null && !templateName.isEmpty()) {
            templateEntity = templateRepository
                    .findById(templateName)
                    .orElseThrow(() -> new BadRequestException("Шаблон с именем " + templateName + " не найден"));
        }

        NotificationEntity notificationEntity = NotificationEntity
                .builder()
                .createdBy(requestDto.getCreatedBy())
                .status(NotificationStatus.CREATED)
                .type(requestDto.getType())
                .attemptCount(0)
                .strategy(strategyEntity)
                .template(templateEntity)
                .payload(objectMapper.convertValue(requestDto.getPayload(), JsonNode.class))
                .build();

        NotificationEntity savedNotificationEntity = notificationRepository.save(notificationEntity);
        log.info("Создано новое уведомление с ID: {} типа {}", savedNotificationEntity.getId(),
                 savedNotificationEntity.getType());

        return mapToResponseDto(savedNotificationEntity);
    }

    @Transactional(readOnly = true)
    public NotificationResponseDto getNotificationById(Long id) {
        return notificationRepository
                .findById(id)
                .map(this::mapToResponseDto)
                .orElseThrow(() -> new NotFoundException("Уведомление с id: " + id + " не найдено"));
    }

    @Transactional(readOnly = true)
    public NotificationEntity getNotificationEntityById(Long id) {
        return notificationRepository
                .findById(id)
                .orElseThrow(() -> new NotFoundException("Уведомление с id: " + id + " не найдено"));
    }

    @Transactional(readOnly = true)
    public Page<NotificationResponseDto> getAllNotifications(Pageable pageable) {
        return notificationRepository.findAll(pageable)
                                     .map(this::mapToResponseDto);
    }

    @Transactional(readOnly = true)
    public Page<NotificationResponseDto> getNotificationsByStatus(NotificationStatus status, Pageable pageable) {
        return notificationRepository.findByStatus(status, pageable)
                                     .map(this::mapToResponseDto);
    }

    @Transactional
    public NotificationResponseDto cancelNotification(Long id) {
        NotificationEntity notificationEntity = notificationRepository
                .findById(id)
                .orElseThrow(() -> new NotFoundException("Уведомление с id: " + id + " не найдено"));

        if (notificationEntity.getStatus() == NotificationStatus.DELIVERED) {
            throw new IllegalStateException("Невозможно отменить уже доставленное уведомление");
        }

        notificationEntity.setStatus(NotificationStatus.CANCELLED);
        NotificationEntity updatedNotificationEntity = notificationRepository.save(notificationEntity);
        log.info("Уведомление с id: {} отменено", id);

        return mapToResponseDto(updatedNotificationEntity);
    }

    @Transactional(readOnly = true)
    public List<NotificationEntity> findNotificationsForRetry() {
        return notificationRepository.findNotificationsForRetry(now());
    }

    @Transactional
    public void switchToProcessing(NotificationEntity notification) {
        int attemptCount = notification.getAttemptCount() + 1;
        notification.setAttemptCount(attemptCount);
        notification.setStatus(NotificationStatus.PROCESSING);
        notification.setLastAttemptAt(now());

        notificationRepository.save(notification);

        log.info("Ставим на оправку уведомление с id: {} Попытка: {}", notification.getId(), attemptCount);
    }

    @Transactional
    public void switchToDelivered(NotificationEntity notification) {
        notification.setStatus(NotificationStatus.DELIVERED);

        notificationRepository.save(notification);

        log.info("Уведомление с id: {} доставлено", notification.getId());
    }

    @Transactional
    public void writeError(NotificationEntity notification, String errorMessage) {
        if (notification.getAttemptCount() >= notification.getStrategy().getMaxRetries()) {
            notification.setStatus(NotificationStatus.FAILED);
            log.info("Уведомление с id: {} переведено в статус: FAILED. Отправка данного уведомления прекращено",
                     notification.getId());
        }

        if (errorMessage != null) {
            notification.setErrorMessage(errorMessage.length() > 999 ? errorMessage.substring(0, 999) : errorMessage);
        }

        notificationRepository.save(notification);
    }

    /**
     * Преобразовать сущность в DTO ответа
     */
    private NotificationResponseDto mapToResponseDto(NotificationEntity notificationEntity) {
        return NotificationResponseDto.builder()
                                      .id(notificationEntity.getId())
                                      .createdAt(notificationEntity.getCreatedAt())
                                      .updatedAt(notificationEntity.getUpdatedAt())
                                      .createdBy(notificationEntity.getCreatedBy())
                                      .status(notificationEntity.getStatus())
                                      .type(notificationEntity.getType())
                                      .lastAttemptAt(notificationEntity.getLastAttemptAt())
                                      .attemptCount(notificationEntity.getAttemptCount())
                                      .strategyName(notificationEntity.getStrategy().getName())
                                      .templateName(notificationEntity.getTemplateName())
                                      .payload(notificationEntity.getPayload())
                                      .errorMessage(notificationEntity.getErrorMessage())
                                      .build();
    }
}
