package ru.mycrg.common_contracts.generated.fts;

import java.util.Map;

public class FtsResponseDto {

    FtsType type;
    Float value;
    Map<String, Object> source;
    Object payload;

    public FtsResponseDto() {
        // Required
    }

    public FtsResponseDto(FtsType type, Float value, Map<String, Object> source, Object payload) {
        this.type = type;
        this.value = value;
        this.source = source;
        this.payload = payload;
    }

    public FtsType getType() {
        return type;
    }

    public void setType(FtsType type) {
        this.type = type;
    }

    public Map<String, Object> getSource() {
        return source;
    }

    public void setSource(Map<String, Object> source) {
        this.source = source;
    }

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Map<String, Object> payload) {
        this.payload = payload;
    }

    public Float getValue() {
        return value;
    }

    public void setValue(Float value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "{" +
                "\"type\":" + (type == null ? "null" : type) + ", " +
                "\"value\":" + (value == null ? "null" : "\"" + value + "\"") + ", " +
                "\"source\":" + (source == null ? "null" : "\"" + source + "\"") + ", " +
                "\"payload\":" + (payload == null ? "null" : "\"" + payload + "\"") +
                "}";
    }
}
