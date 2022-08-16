package ru.mycrg.acceptance.data_service.processes;

public class PlacementPayloadModel {

    private String type;
    private Object payload;

    public PlacementPayloadModel() {
        // Required
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }
}
