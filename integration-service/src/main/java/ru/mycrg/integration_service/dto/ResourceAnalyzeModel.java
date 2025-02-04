package ru.mycrg.integration_service.dto;

import ru.mycrg.resource_analyzer_contract.impl.ResourceDefinition;

import java.io.Serializable;
import java.net.URL;
import java.util.List;

public class ResourceAnalyzeModel implements Serializable {

    private String id;
    private String title;
    private Integer batchSize;
    private List<ResourceDefinition> resourceDefinitions;
    private String errorMessageTemplate;
    private URL url;
    private URL receiveDataUrl;

    public ResourceAnalyzeModel() {
        // Required
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Integer getBatchSize() {
        return batchSize;
    }

    public void setBatchSize(Integer batchSize) {
        this.batchSize = batchSize;
    }

    public List<ResourceDefinition> getResourceDefinitions() {
        return resourceDefinitions;
    }

    public void setResourceDefinitions(
            List<ResourceDefinition> resourceDefinitions) {
        this.resourceDefinitions = resourceDefinitions;
    }

    public String getErrorMessageTemplate() {
        return errorMessageTemplate;
    }

    public void setErrorMessageTemplate(String errorMessageTemplate) {
        this.errorMessageTemplate = errorMessageTemplate;
    }

    public URL getUrl() {
        return url;
    }

    public void setUrl(URL url) {
        this.url = url;
    }

    public URL getReceiveDataUrl() {
        return receiveDataUrl;
    }

    public void setReceiveDataUrl(URL receiveDataUrl) {
        this.receiveDataUrl = receiveDataUrl;
    }
}
