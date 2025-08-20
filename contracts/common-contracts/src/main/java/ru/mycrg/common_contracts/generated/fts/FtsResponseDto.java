package ru.mycrg.common_contracts.generated.fts;

import java.util.Map;
import java.util.Set;

public class FtsResponseDto {

    FtsType type;
    Float value;
    Map<String, Object> source;
    Object payload;
    Set<String> headlines;

    public FtsResponseDto() {
        // Required
    }

    public FtsResponseDto(FtsType type,
                          Float value,
                          Map<String, Object> source,
                          Object payload,
                          Set<String> headlines) {
        this.type = type;
        this.value = value;
        this.source = source;
        this.payload = payload;
        this.headlines = headlines;
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

    public Set<String> getHeadlines() {
        return headlines;
    }

    public void setHeadlines(Set<String> headlines) {
        this.headlines = headlines;
    }

    @Override
    public String toString() {
        return "{" +
                "\"type\":" + (type == null ? "null" : type) + ", " +
                "\"value\":" + (value == null ? "null" : "\"" + value + "\"") + ", " +
                "\"source\":" + (source == null ? "null" : "\"" + source + "\"") + ", " +
                "\"headlines\":" + (headlines == null ? "null" : "\"" + headlines + "\"") + ", " +
                "\"payload\":" + (payload == null ? "null" : "\"" + payload + "\"") +
                "}";
    }
}
