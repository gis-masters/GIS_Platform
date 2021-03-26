package ru.mycrg.data_service_contract.dto;

import java.util.ArrayList;
import java.util.List;

public class ExportProcessModel {

    private String docSchema = "Doc.20301010000";
    private String format;
    private List<ResourceProjection> resourceProjections = new ArrayList<>();

    public String getDocSchema() {
        return docSchema;
    }

    public void setDocSchema(String docSchema) {
        this.docSchema = docSchema;
    }

    public List<ResourceProjection> getResourceProjections() {
        return resourceProjections;
    }

    public void addResource(ResourceProjection projections) {
        this.resourceProjections.add(projections);
    }

    public void setResourceProjections(List<ResourceProjection> resourceProjections) {
        this.resourceProjections = resourceProjections;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }
}
