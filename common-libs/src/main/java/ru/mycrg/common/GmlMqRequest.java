package ru.mycrg.common;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class GmlMqRequest {

    private UUID id;
    private String docSchema = "Doc.20301010000";
    private List<ResourceProjection> resourceProjections = new ArrayList<>();
    private List<EntityTypeDto> fgistpRules = new ArrayList<>();

    public GmlMqRequest() {}

    public GmlMqRequest(UUID id) {
        this.id = id;
    }

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

    public List<EntityTypeDto> getFgistpRules() {
        return fgistpRules;
    }

    public void addRule(EntityTypeDto rule) {
        this.fgistpRules.add(rule);
    }

    public void setResourceProjections(List<ResourceProjection> resourceProjections) {
        this.resourceProjections = resourceProjections;
    }

    public void setFgistpRules(List<EntityTypeDto> fgistpRules) {
        this.fgistpRules = fgistpRules;
    }
}
