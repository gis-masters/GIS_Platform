package ru.mycrg.gis.dto;

import ru.mycrg.gis.enums.ProcessType;

public class WsMessageDto<T> {

    private ProcessType type;
    private T payload;

    public WsMessageDto() {}

    public WsMessageDto(ProcessType type) {
        this.type = type;
    }

    public ProcessType getType() {
        return type;
    }

    public void setType(ProcessType type) {
        this.type = type;
    }

    public T getPayload() {
        return payload;
    }

    public void setPayload(T payload) {
        this.payload = payload;
    }
}
