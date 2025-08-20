package ru.mycrg.gis_service.validators.project;

import com.fasterxml.jackson.core.type.TypeReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import ru.mycrg.common_contracts.generated.gis_service.project.ProjectUpdateDto;
import ru.mycrg.gis_service.exceptions.BadRequestException;

import java.util.List;
import java.util.regex.Pattern;

import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;

@Component
public class ProjectUpdateValidator implements Validator {

    private static final Logger log = LoggerFactory.getLogger(ProjectUpdateValidator.class);

    private static final int MIN_NAME_LENGTH = 3;
    private static final int MAX_NAME_LENGTH = 250;
    private static final int MAX_DESCRIPTION_LENGTH = 2048;
    private static final Pattern NAME_PATTERN = Pattern.compile("^([a-zA-Zа-яА-ЯёЁ]{1}[a-zA-Zа-яА-ЯёЁ0-9._ -]+)$");

    private static final String NAME_FIELD = "name";
    private static final String DESCRIPTION_FIELD = "description";
    private static final String BBOX_FIELD = "bbox";

    @Override
    public boolean supports(Class<?> clazz) {
        return ProjectUpdateDto.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        ProjectUpdateDto project = (ProjectUpdateDto) target;

        validateName(project, errors);
        validateDescription(project, errors);
        validateBbox(project, errors);
    }

    /**
     * Валидация имени проекта. Проверяет длину и формат имени.
     */
    private void validateName(ProjectUpdateDto project, Errors errors) {
        String name = project.getName();
        if (name == null) {
            return;
        }

        if (name.length() < MIN_NAME_LENGTH) {
            errors.rejectValue(NAME_FIELD,
                               null,
                               String.format("Имя должно содержать не менее %d символов", MIN_NAME_LENGTH));
        } else if (name.length() >= MAX_NAME_LENGTH) {
            errors.rejectValue(NAME_FIELD,
                               null,
                               String.format("Имя должно содержать не более %d символов", MAX_NAME_LENGTH));
        }

        // Проверка формата имени с использованием регулярного выражения
        if (!NAME_PATTERN.matcher(name).matches()) {
            errors.rejectValue(NAME_FIELD,
                               null,
                               "Имя должно начинаться с буквы. Затем может содержать: буквы, цифры и символы .-_");
        }
    }

    /**
     * Валидация описания проекта. Проверяет максимальную длину описания.
     */
    private void validateDescription(ProjectUpdateDto project, Errors errors) {
        String description = project.getDescription();
        if (description != null && description.length() > MAX_DESCRIPTION_LENGTH) {
            errors.rejectValue(DESCRIPTION_FIELD,
                               null,
                               String.format("Описание не должно превышать %d символов", MAX_DESCRIPTION_LENGTH));
        }
    }

    /**
     * Валидация bbox проекта. Проверяет длину и формат bbox, используя BboxValidator.
     */
    private void validateBbox(ProjectUpdateDto project, Errors errors) {
        String bbox = project.getBbox();
        if (bbox == null) {
            return;
        }

        try {
            TypeReference<List<Double>> type = new TypeReference<>() {
            };
            List<Double> coordinates = objectMapper.readValue(bbox, type);
            if (!coordinates.isEmpty() && coordinates.size() != 4) {
                String msg = "Невалидный bbox: '" + bbox + "' Поле bbox должно состоять из 4 чисел";

                throw new BadRequestException(msg);
            }
        } catch (Exception e) {
            log.error("Не удалось получить bbox из: '{}' => {}", bbox, e.getMessage(), e);

            errors.rejectValue(BBOX_FIELD, null, e.getMessage());
        }
    }
}
