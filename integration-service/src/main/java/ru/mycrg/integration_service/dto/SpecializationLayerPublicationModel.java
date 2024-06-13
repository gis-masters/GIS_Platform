package ru.mycrg.integration_service.dto;

import java.io.Serializable;

public class SpecializationLayerPublicationModel implements Serializable {

    public Integer id;
    public final String type = "vector";
    public final boolean enabled = true;

    public String dataset;
    public String tableName;
    public String title;
    public String nativeCRS;
    public String styleName;

    public SpecializationLayerPublicationModel() {
        // Required
    }

    public SpecializationLayerPublicationModel(Integer id, String title, String nativeCRS, String styleName,
                                               String dataset, String tableName) {
        this.id = id;
        this.title = title;
        this.nativeCRS = nativeCRS;
        this.styleName = styleName;
        this.dataset = dataset;
        this.tableName = tableName;
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

    public String getTableName() {
        return tableName;
    }

    @Override
    public String toString() {
        return "{" +
                "\"id\":" + (id == null ? "null" : "\"" + id + "\"") + ", " +
                "\"type\":" + (type == null ? "null" : "\"" + type + "\"") + ", " +
                "\"enabled\":\"" + enabled + "\"" + ", " +
                "\"dataset\":" + (dataset == null ? "null" : "\"" + dataset + "\"") + ", " +
                "\"tableName\":" + (tableName == null ? "null" : "\"" + tableName + "\"") + ", " +
                "\"title\":" + (title == null ? "null" : "\"" + title + "\"") + ", " +
                "\"nativeCRS\":" + (nativeCRS == null ? "null" : "\"" + nativeCRS + "\"") + ", " +
                "\"styleName\":" + (styleName == null ? "null" : "\"" + styleName + "\"") +
                "}";
    }
}
