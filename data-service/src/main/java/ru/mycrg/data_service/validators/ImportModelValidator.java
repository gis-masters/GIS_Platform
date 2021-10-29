package ru.mycrg.data_service.validators;

import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.service.processes.dto.ImportInitializingModel;
import ru.mycrg.data_service.service.processes.dto.ImportSource;
import ru.mycrg.data_service.service.processes.dto.ImportTarget;

import java.util.regex.Pattern;

public class ImportModelValidator {

    private ImportModelValidator() {
        throw new IllegalStateException("Utility class");
    }

    public static void throwIfNotValid(ImportInitializingModel dto) {
        String required = "Обязательно для заполнения";
        String common = "Не корректно заданное поле";
        String size = "Не менее 3 и не более 250 символов";
        String negativeValue = "Не должно быть отрицательным";
        String patternMsg = "Должно начинаться с буквы. Затем может содержать: буквы, цифры и символы .-_";

        ImportTarget target = dto.getTarget();
        ImportSource source = dto.getSource();

        if (target == null) {
            throw new BadRequestException(required, new ErrorInfo("target", required));
        }

        if (source == null) {
            throw new BadRequestException(required, new ErrorInfo("source", required));
        }

        if (target.isProjectIsNew()) {
            if (target.getProjectName() == null) {
                throw new BadRequestException(common, new ErrorInfo("projectName", required));
            }
        } else {
            if (target.getProjectId() == null) {
                throw new BadRequestException(common, new ErrorInfo("projectId", required));
            }
        }

        final String projectName = target.getProjectName();
        if (projectName != null) {
            if (projectName.length() < 3 || projectName.length() > 250) {
                throw new BadRequestException(common, new ErrorInfo("projectName", size));
            }

            Pattern pattern = Pattern.compile("^([a-zA-Zа-яА-ЯёЁ]{1}[a-zA-Zа-яА-ЯёЁ0-9._ -]+)$");
            if (!pattern.matcher(projectName).find()) {
                throw new BadRequestException(patternMsg, new ErrorInfo("projectName", patternMsg));
            }
        }

        if (target.getProjectId() != null && target.getProjectId() < 1) {
            throw new BadRequestException(common, new ErrorInfo("projectId", negativeValue));
        }

        if (source.getObjectId() == null) {
            throw new BadRequestException(common, new ErrorInfo("objectId", required));
        }

        if (source.getObjectId() < 1) {
            throw new BadRequestException(common, new ErrorInfo("objectId", negativeValue));
        }

        if (source.getLibraryId() != null && source.getLibraryId().isBlank()) {
            throw new BadRequestException(common, new ErrorInfo("libraryId", required));
        }

        if (dto.getWsUiId() == null || dto.getWsUiId().isBlank()) {
            throw new BadRequestException(common, new ErrorInfo("wsUiId", required));
        }
    }
}
