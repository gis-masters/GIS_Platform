package ru.mycrg.data_service_contract.dto.import_;

/**
 * Настройки валидации импорта КПТ
 */
public class KptImportValidationSettings {

    private boolean validateRecordsCount = false;
    private boolean validateFreshness = false;
    /**
     * Допустимая разница в количестве между существующими записями по кварталу и импортируемыми
     */
    private Integer allowedDiff;
    /**
     * "Свежесть" импортируемого КПТ. Timestamp в строковом представлении
     */
    private String dateOrderCompletion;

    public Integer getAllowedDiff() {
        return allowedDiff;
    }

    public void setAllowedDiff(Integer allowedDiff) {
        this.allowedDiff = allowedDiff;
    }

    public boolean isValidateRecordsCount() {
        return validateRecordsCount;
    }

    public void setValidateRecordsCount(boolean validateRecordsCount) {
        this.validateRecordsCount = validateRecordsCount;
    }

    public boolean isValidateFreshness() {
        return validateFreshness;
    }

    public void setValidateFreshness(boolean validateFreshness) {
        this.validateFreshness = validateFreshness;
    }

    public String getDateOrderCompletion() {
        return dateOrderCompletion;
    }

    public void setDateOrderCompletion(String dateOrderCompletion) {
        this.dateOrderCompletion = dateOrderCompletion;
    }
}
