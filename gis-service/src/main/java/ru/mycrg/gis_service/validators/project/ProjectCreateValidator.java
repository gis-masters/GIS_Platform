package ru.mycrg.gis_service.validators.project;

import org.springframework.stereotype.Component;
import org.springframework.validation.Errors;
import org.springframework.validation.Validator;
import ru.mycrg.common_contracts.generated.gis_service.project.ProjectCreateDto;

@Component
public class ProjectCreateValidator implements Validator {

    private final ProjectUpdateValidator projectUpdateValidator;

    public ProjectCreateValidator(ProjectUpdateValidator projectUpdateValidator) {
        this.projectUpdateValidator = projectUpdateValidator;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return ProjectCreateDto.class.isAssignableFrom(clazz);
    }

    @Override
    public void validate(Object target, Errors errors) {
        ProjectCreateDto project = (ProjectCreateDto) target;

        // Сначала валидируем базовые поля с помощью ProjectUpdateValidator
        projectUpdateValidator.validate(project, errors);

        // Затем валидируем дополнительные поля, специфичные для ProjectCreateDto
        validateName(project, errors);
        validateIsDefault(project, errors);
        validateIsFolder(project, errors);
    }

    private void validateName(ProjectCreateDto project, Errors errors) {
        String name = project.getName();
        if (name == null) {
            errors.rejectValue("name", null, "Имя является обязательным");
        }
    }

    /**
     * Валидация поля isDefault. Проверяет, что папка не может быть проектом по умолчанию.
     */
    private void validateIsDefault(ProjectCreateDto project, Errors errors) {
        // Папка не может быть проектом по умолчанию
        if (project.isFolder() && project.isDefault()) {
            errors.rejectValue("isDefault", null, "Папка не может быть проектом по умолчанию");
        }
    }

    /**
     * Валидация поля isFolder. Проверяет ограничения, связанные с папками.
     */
    private void validateIsFolder(ProjectCreateDto project, Errors errors) {
        // Если проект является папкой, то он не должен иметь bbox
        if (project.isFolder() && project.getBbox() != null && !project.getBbox().isEmpty()) {
            errors.rejectValue("bbox", null, "Папка не должна иметь координат (bbox)");
        }
    }
}
