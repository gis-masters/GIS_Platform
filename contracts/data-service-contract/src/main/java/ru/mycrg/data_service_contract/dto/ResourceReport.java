package ru.mycrg.data_service_contract.dto;

public class ResourceReport {

    private String title;
    private String message;
    private boolean success;

    public ResourceReport(String title, String message, boolean success) {
        this.title = title;
        this.message = message;
        this.success = success;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }
}
