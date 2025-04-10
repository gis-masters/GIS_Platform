package ru.mycrg.common_contracts.generated.data_service;

public class GeometryValidationResultDto {

    private final boolean isValid;
    private final String message;

    public GeometryValidationResultDto(boolean isValid, String message) {
        this.isValid = isValid;
        this.message = message;
    }

    public boolean isValid() {
        return isValid;
    }

    public String getMessage() {
        return message;
    }
}
