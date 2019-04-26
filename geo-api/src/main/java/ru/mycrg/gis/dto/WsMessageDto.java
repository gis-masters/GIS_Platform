package ru.mycrg.gis.dto;

import ru.mycrg.common.enums.RequestType;

public class WsMessageDto<T> {

    private RequestType type;
    private T payload;

    public WsMessageDto() {}

    public WsMessageDto(RequestType type, T response) {
        this.type = type;
        this.payload = response;
    }

    public RequestType getType() {
        return type;
    }

    public void setType(RequestType type) {
        this.type = type;
    }

    public T getPayload() {
        return payload;
    }

    public void setPayload(T payload) {
        this.payload = payload;
    }
}
