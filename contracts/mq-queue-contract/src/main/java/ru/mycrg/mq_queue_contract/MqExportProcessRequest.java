package ru.mycrg.mq_queue_contract;

import java.util.ArrayList;
import java.util.List;

public class MqExportProcessRequest {

    private String docSchema = "Doc.20301010000";
    private String format;
    private List<ResourceProjection> resourceProjections = new ArrayList<>();
    private List<SchemaDto> fgistpRules = new ArrayList<>();

    public MqExportProcessRequest() {}

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

    public List<SchemaDto> getFgistpRules() {
        return fgistpRules;
    }

    public void addRule(SchemaDto rule) {
        this.fgistpRules.add(rule);
    }

    public void setResourceProjections(List<ResourceProjection> resourceProjections) {
        this.resourceProjections = resourceProjections;
    }

    public void setFgistpRules(List<SchemaDto> fgistpRules) {
        this.fgistpRules = fgistpRules;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }
}
