package ru.mycrg.notification.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;

/**
 * Класс для логирования валидационных ошибок
 * Аспект удален, так как не используется AOP
 */
@Component
public class ValidationAspect {
    
    private static final Logger log = LoggerFactory.getLogger(ValidationAspect.class);
    
    /**
     * Логирует ошибки валидации
     */
    public void logValidationErrors(BindingResult bindingResult, String controllerName, String methodName) {
        if (bindingResult != null && bindingResult.hasErrors()) {
            log.warn("Validation errors in request to {}.{}(): {}",
                    controllerName,
                    methodName,
                    bindingResult.getAllErrors());
        }
    }
}