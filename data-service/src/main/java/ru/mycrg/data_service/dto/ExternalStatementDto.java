package ru.mycrg.data_service.dto;

import javax.validation.constraints.Size;

public class ExternalStatementDto {

    @Size(max = 255, message = "Не должно превышать 255 символов")
    private String statementNum;

    private String type;

    @Size(max = 255, message = "Не должно превышать 255 символов")
    private String cadNum;

    private String applicant;

    @Size(max = 255, message = "Не должно превышать 255 символов")
    private String status;

    @Size(max = 255, message = "Не должно превышать 255 символов")
    private String statementDate;

    public String getStatementNum() {
        return statementNum;
    }

    public void setStatementNum(String statementNum) {
        this.statementNum = statementNum;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCadNum() {
        return cadNum;
    }

    public void setCadNum(String cadNum) {
        this.cadNum = cadNum;
    }

    public String getApplicant() {
        return applicant;
    }

    public void setApplicant(String applicant) {
        this.applicant = applicant;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatementDate() {
        return statementDate;
    }

    public void setStatementDate(String statementDate) {
        this.statementDate = statementDate;
    }
}
