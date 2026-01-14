package ru.mycrg.data_service_client.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public class SimplifiedFeatureResponse {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("properties")
    private Map<String, Object> properties;

    public SimplifiedFeatureResponse() {
    }

    public SimplifiedFeatureResponse(Long id, Map<String, Object> properties) {
        this.id = id;
        this.properties = properties;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Map<String, Object> getProperties() {
        return properties;
    }

    public void setProperties(Map<String, Object> properties) {
        this.properties = properties;
    }
}
