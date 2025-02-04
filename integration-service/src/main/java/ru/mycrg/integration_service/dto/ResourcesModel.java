package ru.mycrg.integration_service.dto;

import java.io.Serializable;
import java.util.List;

public class ResourcesModel implements Serializable {

    private List<ResourceModel> resources;

    public ResourcesModel() {
        // Required
    }

    public List<ResourceModel> getResources() {
        return resources;
    }

    public void setResources(List<ResourceModel> resources) {
        this.resources = resources;
    }
}
