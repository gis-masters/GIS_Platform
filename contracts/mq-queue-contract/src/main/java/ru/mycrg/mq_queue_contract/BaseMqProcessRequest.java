package ru.mycrg.mq_queue_contract;

import ru.mycrg.mq_queue_contract.enums.ProcessType;

public class BaseMqProcessRequest {

    private Long id;
    private String dbName;
    private ProcessType type;
    private Object payload;

    public BaseMqProcessRequest() {
        // Framework required
    }

    public BaseMqProcessRequest(BaseMqProcessRequest request) {
        this.id = request.getId();
        this.dbName = request.getDbName();
        this.type = request.getType();
        this.payload = request.getPayload();
    }

    public BaseMqProcessRequest(String dbName, Long id, ProcessType type, Object payload) {
        this.id = id;
        this.dbName = dbName;
        this.type = type;
        this.payload = payload;
    }

    public BaseMqProcessRequest(BaseMqProcessRequest request, Object payload) {
        this.id = request.getId();
        this.dbName = request.getDbName();
        this.type = request.getType();
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

    public String getDbName() {
        return dbName;
    }
}
