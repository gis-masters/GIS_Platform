package ru.mycrg.common;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class GmlMqRequest {

    private UUID id;
    private String docSchema = "Doc.20301010000";
    private List<ResourceProjection> resourceProjections = new ArrayList<>();
    private List<EntityType> fgistpRules = new ArrayList<>();

    public GmlMqRequest() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

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

    public List<EntityType> getFgistpRules() {
        return fgistpRules;
    }

    public void setFgistpRules(List<EntityType> fgistpRules) {
        this.fgistpRules = fgistpRules;
    }
}
