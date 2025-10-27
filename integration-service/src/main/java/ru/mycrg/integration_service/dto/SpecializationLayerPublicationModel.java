package ru.mycrg.integration_service.dto;

import java.io.Serializable;

public class SpecializationLayerPublicationModel implements Serializable {

    public Integer id;
    public final String type = "vector";
    public final boolean enabled = true;

    public String dataset;
    public String resourceId;
    public String title;
    public String nativeCRS;
    public String styleName;

    public SpecializationLayerPublicationModel() {
        // Required
    }

    public SpecializationLayerPublicationModel(Integer id, String title, String nativeCRS, String styleName,
                                               String dataset, String resourceId) {
        this.id = id;
        this.title = title;
        this.nativeCRS = nativeCRS;
        this.styleName = styleName;
        this.dataset = dataset;
        this.resourceId = resourceId;
    }

    public Integer getId() {
        return id;
    }

    public String getType() {
        return type;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public String getTitle() {
        return title;
    }

    public String getNativeCRS() {
        return nativeCRS;
    }

    public String getStyleName() {
        return styleName;
    }

    public String getDataset() {
        return dataset;
    }

    public String getResourceId() {
        return resourceId;
    }

    @Override
    public String toString() {
        return "{" +
                "\"id\":" + (id == null ? "null" : "\"" + id + "\"") + ", " +
                "\"type\":" + (type == null ? "null" : "\"" + type + "\"") + ", " +
                "\"enabled\":\"" + enabled + "\"" + ", " +
                "\"dataset\":" + (dataset == null ? "null" : "\"" + dataset + "\"") + ", " +
                "\"resourceId\":" + (resourceId == null ? "null" : "\"" + resourceId + "\"") + ", " +
                "\"title\":" + (title == null ? "null" : "\"" + title + "\"") + ", " +
                "\"nativeCRS\":" + (nativeCRS == null ? "null" : "\"" + nativeCRS + "\"") + ", " +
                "\"styleName\":" + (styleName == null ? "null" : "\"" + styleName + "\"") +
                "}";
    }
}
