package ru.mycrg.common_contracts.generated.fts;

import java.util.List;
import java.util.Map;

public class FtsRequestDto {

    String text;
    String ecqlFilter;
    FtsType type;
    Float bound;
    List<Map<String, Object>> sources;

    public FtsRequestDto() {
        // Required
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getEcqlFilter() {
        return ecqlFilter;
    }

    public void setEcqlFilter(String ecqlFilter) {
        this.ecqlFilter = ecqlFilter;
    }

    public FtsType getType() {
        return type;
    }

    public void setType(FtsType type) {
        this.type = type;
    }

    public List<Map<String, Object>> getSources() {
        return sources;
    }

    public void setSources(List<Map<String, Object>> sources) {
        this.sources = sources;
    }

    public Float getBound() {
        return bound;
    }

    public void setBound(Float bound) {
        this.bound = bound;
    }

    @Override
    public String toString() {
        return "{" +
                "\"text\":" + (text == null ? "null" : "\"" + text + "\"") + ", " +
                "\"ecqlFilter\":" + (ecqlFilter == null ? "null" : "\"" + ecqlFilter + "\"") + ", " +
                "\"type\":" + (type == null ? "null" : type) + ", " +
                "\"bound\":\"" + bound + "\"" + ", " +
                "\"sources\":" + (sources == null ? "null" : sources) +
                "}";
    }
}
