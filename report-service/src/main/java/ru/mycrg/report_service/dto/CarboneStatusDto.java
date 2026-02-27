package ru.mycrg.report_service.dto;

public class CarboneStatusDto {
    private boolean success;
    private int code;
    private String message;
    private String version;

    public CarboneStatusDto() {
    }

    public CarboneStatusDto(boolean success, int code, String message, String version) {
        this.success = success;
        this.code = code;
        this.message = message;
        this.version = version;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    @Override
    public String toString() {
        return "{" +
                "\"success\":\"" + success + "\"" + ", " +
                "\"code\":\"" + code + "\"" + ", " +
                "\"message\":" + (message == null ? "null" : "\"" + message + "\"") + ", " +
                "\"version\":" + (version == null ? "null" : "\"" + version + "\"") +
                "}";
    }
}
