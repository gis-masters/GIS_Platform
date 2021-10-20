package ru.mycrg.data_service.validators;

import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.service.import_.model.ImportGmlRequestModel;

import java.util.regex.Pattern;

public class ImportGmlValidator {

    private ImportGmlValidator() {
        throw new IllegalStateException("Utility class");
    }

    public static void throwIfNotValid(ImportGmlRequestModel dto) {
        String required = "Обязательно для заполнения";
        String common = "Не корректно заданное поле";
        String size = "Не менее 3 и не более 250 символов";
        String negativeValue = "Не должно быть отрицательным";
        String patternMsg = "Должно начинаться с буквы. Затем может содержать: буквы, цифры и символы .-_";

        if (dto.isProjectIsNew()) {
            if (dto.getProjectName() == null) {
                throw new BadRequestException(common, new ErrorInfo("projectName", required));
            }
        } else {
            if (dto.getProjectId() == null) {
                throw new BadRequestException(common, new ErrorInfo("projectId", required));
            }
        }

        final String projectName = dto.getProjectName();
        if (projectName != null) {
            if (projectName.length() < 3 || projectName.length() > 250) {
                throw new BadRequestException(common, new ErrorInfo("projectName", size));
            }

            Pattern pattern = Pattern.compile("^([a-zA-Zа-яА-ЯёЁ]{1}[a-zA-Zа-яА-ЯёЁ0-9._ -]+)$");
            if (!pattern.matcher(projectName).find()) {
                throw new BadRequestException(patternMsg, new ErrorInfo("projectName", patternMsg));
            }
        }

        if (dto.getProjectId() != null && dto.getProjectId() < 1) {
            throw new BadRequestException(common, new ErrorInfo("projectId", negativeValue));
        }

        if (dto.getObjectId() == null) {
            throw new BadRequestException(common, new ErrorInfo("objectId", required));
        }

        if (dto.getObjectId() < 1) {
            throw new BadRequestException(common, new ErrorInfo("objectId", negativeValue));
        }

        if (dto.getLibraryId() != null && dto.getLibraryId().isBlank()) {
            throw new BadRequestException(common, new ErrorInfo("libraryId", required));
        }

        if (dto.getWsUiId() == null || dto.getWsUiId().isBlank()) {
            throw new BadRequestException(common, new ErrorInfo("wsUiId", required));
        }
    }
}
