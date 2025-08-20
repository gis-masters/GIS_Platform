package ru.mycrg.data_service.validators;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import ru.mycrg.schemas.IEntityProperty;

@Component
public class EntityPropertyValidator implements Validator {

    private final Logger log = LoggerFactory.getLogger(EntityPropertyValidator.class);

    @Override
    public boolean supports(@NotNull Class<?> clazz) {
        return true;
    }

    @Override
    public void validate(Object obj, @NotNull Errors errors) {
        try {
            final IEntityProperty property = (IEntityProperty) obj;

            validateBase(property, errors);
        } catch (Exception e) {
            log.error("Failed to validate entity property. Reason: {}", e.getMessage());

            // 400 badRequest instead 500
            errors.rejectValue("entity", "invalid.entity", e.getMessage());
        }
    }

    private void validateBase(IEntityProperty property, Errors errors) {
        if (property.getName() == null) {
            errors.rejectValue("name", "required", "Обязательно к заполнению");
        }

        if (property.getTitle() == null) {
            errors.rejectValue("title", "required", "Обязательно к заполнению");
        }

        if (property.getPropertyType() == null) {
            errors.rejectValue("propertyType", "required", "Обязательно к заполнению");
        }
    }
}
