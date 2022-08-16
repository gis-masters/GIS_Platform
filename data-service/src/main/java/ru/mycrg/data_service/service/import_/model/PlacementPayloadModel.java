package ru.mycrg.data_service.service.import_.model;

import ru.mycrg.data_service_contract.enums.ProcessType;

public class PlacementPayloadModel {

    private ProcessType type;
    private Object payload;

    public PlacementPayloadModel() {
        // Required
    }

    public ProcessType getType() {
        return type;
    }

    public void setType(ProcessType type) {
        this.type = type;
    }

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }
}
