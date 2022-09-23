package ru.mycrg.data_service.dto;

public class WsMessageDto<T> {

    private String type;
    private T payload;

    public WsMessageDto() {}

    public WsMessageDto(String type, T response) {
        this.type = type;
        this.payload = response;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public T getPayload() {
        return payload;
    }

    public void setPayload(T payload) {
        this.payload = payload;
    }
}
