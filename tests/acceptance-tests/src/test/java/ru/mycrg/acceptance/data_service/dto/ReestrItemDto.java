package ru.mycrg.acceptance.data_service.dto;

public class ReestrItemDto {

    private final String system;
    private final String user_from;
    private final String status;
    private final String body;

    public ReestrItemDto(String system, String user_from, String status, String body) {
        this.system = system;
        this.user_from = user_from;
        this.status = status;
        this.body = body;
    }

    public String getSystem() {
        return system;
    }

    public String getUser_from() {
        return user_from;
    }

    public String getStatus() {
        return status;
    }

    public String getBody() {
        return body;
    }
}
