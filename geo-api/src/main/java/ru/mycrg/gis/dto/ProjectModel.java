package ru.mycrg.gis.dto;

import com.fasterxml.jackson.databind.JsonNode;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.gis.entity.Project;

public class ProjectModel {

    private long id;
    private String workspaceName;
    private String databaseName;
    private String storeName;
    private String internalName;
    private ProcessStatus status;
    private JsonNode extra;

    public ProjectModel() {}

    public ProjectModel(Project project) {
        this.id = project.getId();
        this.workspaceName = project.getGeoserverName();
        this.internalName = project.getInternalName();
        this.status = project.getStatus();
        this.extra = project.getExtra();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getWorkspaceName() {
        return workspaceName;
    }

    public void setWorkspaceName(String workspaceName) {
        this.workspaceName = workspaceName;
    }

    public String getDatabaseName() {
        return databaseName;
    }

    public void setDatabaseName(String databaseName) {
        this.databaseName = databaseName;
    }

    public String getStoreName() {
        return storeName;
    }

    public void setStoreName(String storeName) {
        this.storeName = storeName;
    }

    public String getInternalName() {
        return internalName;
    }

    public void setInternalName(String internalName) {
        this.internalName = internalName;
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }

    public JsonNode getExtra() {
        return extra;
    }

    public void setExtra(JsonNode extra) {
        this.extra = extra;
    }
}
