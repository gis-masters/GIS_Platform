package ru.mycrg.data_service.validators;

import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.service.import_.dto.GmlPlacementModel;

public class GmlPlacementModelValidator {

    private GmlPlacementModelValidator() {
        throw new IllegalStateException("Utility class");
    }

    public static void throwIfNotValid(GmlPlacementModel dto) {
        String required = "Обязательно для заполнения";
        String common = "Не корректно заданное поле";

        if (dto.getFileId() == null || dto.getFileId().toString().isBlank()) {
            throw new BadRequestException(common, new ErrorInfo("fileId", required));
        }

        if (dto.getProjectId() == null) {
            throw new BadRequestException(common, new ErrorInfo("projectId", required));
        }

        if (dto.getWsUiId() == null || dto.getWsUiId().isBlank()) {
            throw new BadRequestException(common, new ErrorInfo("wsUiId", required));
        }
    }
}
