package ru.mycrg.notification.domain.notification.mapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.notification.domain.notification.dto.NotificationRequestDto;
import ru.mycrg.notification.domain.notification.models.NotificationEntity;
import ru.mycrg.notification.domain.notification.models.Property;
import ru.mycrg.notification.domain.notification.models.payload.EmailPayload;
import ru.mycrg.notification.domain.notification.models.payload.NotificationPayload;
import ru.mycrg.notification.domain.notification.models.payload.TelegramPayload;
import ru.mycrg.notification.domain.strategy.StrategyEntity;
import ru.mycrg.notification.domain.template.entity.TemplateEntity;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.List;

@Component
public class NotificationMapper {
    
    private static final Logger log = LoggerFactory.getLogger(NotificationMapper.class);
    
    private final ObjectMapper objectMapper;
    
    public NotificationMapper(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }
    
    public NotificationEntity toEntity(NotificationRequestDto dto, StrategyEntity strategy, TemplateEntity template) {
        NotificationEntity entity = new NotificationEntity();
        entity.setType(dto.getType());
        entity.setCreatedBy(dto.getCreatedBy());
        entity.setStrategy(strategy);
        entity.setTemplate(template);
        
        // Преобразуем payload в JsonNode
        if (dto.getPayload() != null) {
            try {
                entity.setPayload(objectMapper.convertValue(dto.getPayload(), JsonNode.class));
            } catch (Exception e) {
                log.error("Ошибка при преобразовании payload в JsonNode: {}", e.getMessage());
                // Создаем пустой JsonNode
                entity.setPayload(objectMapper.createObjectNode());
            }
        }
        
        return entity;
    }
    
    public NotificationRequestDto toDto(NotificationEntity entity) {
        NotificationRequestDto dto = new NotificationRequestDto();
        dto.setType(entity.getType());
        dto.setCreatedBy(entity.getCreatedBy());
        
        if (entity.getStrategy() != null) {
            dto.setStrategyName(entity.getStrategy().getName());
        }
        
        if (entity.getTemplate() != null) {
            dto.setTemplateName(entity.getTemplate().getName());
        }
        
        // Преобразуем payload в соответствующий объект в зависимости от типа
        if (entity.getPayload() != null) {
            try {
                if (entity.getType() == null) {
                    // Если тип не указан, используем базовый класс
                    NotificationPayload payload = objectMapper.treeToValue(entity.getPayload(), NotificationPayload.class);
                    dto.setPayload(payload);
                } else {
                    switch (entity.getType()) {
                        case TELEGRAM:
                            TelegramPayload telegramPayload = objectMapper.treeToValue(entity.getPayload(), TelegramPayload.class);
                            dto.setPayload(telegramPayload);
                            break;
                        case EMAIL:
                            EmailPayload emailPayload = objectMapper.treeToValue(entity.getPayload(), EmailPayload.class);
                            dto.setPayload(emailPayload);
                            break;
                        default:
                            // Для других типов используем базовый класс
                            NotificationPayload payload = objectMapper.treeToValue(entity.getPayload(), NotificationPayload.class);
                            dto.setPayload(payload);
                            break;
                    }
                }
            } catch (Exception e) {
                log.error("Ошибка при десериализации payload для уведомления типа {}: {}", 
                          entity.getType(), e.getMessage());
                
                // В случае ошибки десериализации, создаем пустой payload соответствующего типа
                NotificationPayload payload;
                if (entity.getType() == null) {
                    payload = new NotificationPayload();
                } else {
                    switch (entity.getType()) {
                        case TELEGRAM:
                            payload = new TelegramPayload();
                            break;
                        case EMAIL:
                            payload = new EmailPayload();
                            break;
                        default:
                            payload = new NotificationPayload();
                            break;
                    }
                }
                
                // Пытаемся скопировать props из исходного payload
                try {
                    JsonNode propsNode = entity.getPayload().get("props");
                    if (propsNode != null && propsNode.isArray()) {
                        payload.setProps(objectMapper.treeToValue(propsNode, 
                                         objectMapper.getTypeFactory().constructCollectionType(List.class, 
                                         Property.class)));
                    }
                } catch (Exception ex) {
                    log.warn("Не удалось скопировать props из исходного payload: {}", ex.getMessage());
                }
                
                // Проверяем, что payload имеет тип NotificationPayload
                if (payload instanceof NotificationPayload) {
                    dto.setPayload((NotificationPayload) payload);
                } else {
                    // Если payload не является NotificationPayload, создаем новый объект
                    NotificationPayload newPayload = new NotificationPayload();
                    dto.setPayload(newPayload);
                }
            }
        }
        
        return dto;
    }
}
