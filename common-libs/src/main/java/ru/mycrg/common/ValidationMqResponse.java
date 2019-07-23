package ru.mycrg.common;

import java.util.ArrayList;
import java.util.List;

public class ValidationMqResponse {

    private String layerName;
    private Long total = 0L;
    private boolean isValidated;
    private String lastValidated;
    private List<ObjectValidationResult> results = new ArrayList<>();

    // При общем информационном запросе
    private List<ValidationInfo> briefly = new ArrayList<>();

    public ValidationMqResponse() {}

    public ValidationMqResponse(String layerName) {
        this.layerName = layerName;
    }

    public Long getTotal() {
        return total;
    }

    public void setTotal(Long total) {
        this.total = total;
    }

    public boolean isValidated() {
        return isValidated;
    }

    public void setValidated(boolean validated) {
        isValidated = validated;
    }

    public String getLastValidated() {
        return lastValidated;
    }

    public void setLastValidated(String lastValidated) {
        this.lastValidated = lastValidated;
    }

    public List<ValidationInfo> getBriefly() {
        return briefly;
    }

    public void addBrieflyInfo(ValidationInfo validationInfo) {
        briefly.add(validationInfo);
    }

    public List<ObjectValidationResult> getResults() {
        return results;
    }

    public void setResults(List<ObjectValidationResult> results) {
        this.results = results;
    }

    public String getLayerName() {
        return layerName;
    }

    public void setLayerName(String layerName) {
        this.layerName = layerName;
    }
}
