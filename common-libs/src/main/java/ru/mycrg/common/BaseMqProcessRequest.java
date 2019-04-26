package ru.mycrg.common;

import ru.mycrg.common.enums.RequestType;

import java.util.UUID;

public class BaseMqProcessRequest {

    private UUID id;
    private RequestType type;

    public BaseMqProcessRequest() {
    }

    public BaseMqProcessRequest(UUID id) {
        this.id = id;
    }

    public BaseMqProcessRequest(RequestType type) {
        this.type = type;
    }

    public BaseMqProcessRequest(UUID id, RequestType type) {
        this.id = id;
        this.type = type;
    }

    public UUID getId() {
        return id;
    }

    public RequestType getType() {
        return type;
    }

}
