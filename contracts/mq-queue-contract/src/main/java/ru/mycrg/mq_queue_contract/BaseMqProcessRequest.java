package ru.mycrg.mq_queue_contract;

import ru.mycrg.mq_queue_contract.enums.ProcessType;

public class BaseMqProcessRequest {

    private Long id;
    private ProcessType type;
    private Object payload;

    public BaseMqProcessRequest() {
    }

    public BaseMqProcessRequest(Long id) {
        this.id = id;
    }

    public BaseMqProcessRequest(Long id, ProcessType type) {
        this.id = id;
        this.type = type;
    }

    public BaseMqProcessRequest(Long id, ProcessType type, Object payload) {
        this.id = id;
        this.type = type;
        this.payload = payload;
    }

    public Long getId() {
        return id;
    }

    public ProcessType getType() {
        return type;
    }

    public void setType(ProcessType type) {
        this.type = type;
    }

    public Object getPayload() {
        if (payload == null) {
            return "";
        } else {
            return payload;
        }
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }
}
