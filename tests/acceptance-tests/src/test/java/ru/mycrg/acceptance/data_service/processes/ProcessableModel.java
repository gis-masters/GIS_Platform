package ru.mycrg.acceptance.data_service.processes;

public class ProcessableModel {

    Object payload;
    String type;

    public ProcessableModel() {
        // Required
    }

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
