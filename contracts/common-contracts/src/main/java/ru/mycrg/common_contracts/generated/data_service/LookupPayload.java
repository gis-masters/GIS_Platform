package ru.mycrg.common_contracts.generated.data_service;

public class LookupPayload {

    private String type;
    private Object payload;

    public LookupPayload() {
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

    @Override
    public String toString() {
        return "{" +
                "\"type\":" + (type == null ? "null" : "\"" + type + "\"") + ", " +
                "\"payload\":" + (payload == null ? "null" : "\"" + payload + "\"") +
                "}";
    }
}
