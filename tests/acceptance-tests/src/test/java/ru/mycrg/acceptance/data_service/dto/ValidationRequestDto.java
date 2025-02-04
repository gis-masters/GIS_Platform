package ru.mycrg.acceptance.data_service.dto;

import java.util.ArrayList;
import java.util.List;

public class ValidationRequestDto {

    private String wsUiId;
    private String targetSchema;

    private List<ExportResourceModel> resources = new ArrayList<>();

    public String getWsUiId() {
        return wsUiId;
    }

    public void setWsUiId(String wsUiId) {
        this.wsUiId = wsUiId;
    }

    public String getTargetSchema() {
        return targetSchema;
    }

    public void setTargetSchema(String targetSchema) {
        this.targetSchema = targetSchema;
    }

    public List<ExportResourceModel> getResources() {
        return resources;
    }

    public void setResources(List<ExportResourceModel> resources) {
        this.resources = resources;
    }
}
