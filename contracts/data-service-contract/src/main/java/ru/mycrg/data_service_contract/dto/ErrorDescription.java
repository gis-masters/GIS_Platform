package ru.mycrg.data_service_contract.dto;

public class ErrorDescription {

    private String attribute;
    private String error;

    public ErrorDescription() {
    }

    public ErrorDescription(String attribute, String error) {
        this.attribute = attribute;
        this.error = error;
    }

    public String getAttribute() {
        return attribute;
    }

    public void setAttribute(String attribute) {
        this.attribute = attribute;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }
}
