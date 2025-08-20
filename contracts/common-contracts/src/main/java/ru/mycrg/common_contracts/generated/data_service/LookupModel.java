package ru.mycrg.common_contracts.generated.data_service;

public class LookupModel {

    private String key;
    private LookupPayload payload;

    public LookupModel() {
        // Required
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public LookupPayload getPayload() {
        return payload;
    }

    public void setPayload(LookupPayload payload) {
        this.payload = payload;
    }

    @Override
    public String toString() {
        return "{" +
                "\"key\":" + (key == null ? "null" : "\"" + key + "\"") + ", " +
                "\"payload\":" + (payload == null ? "null" : payload) +
                "}";
    }
}
