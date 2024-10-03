package ru.mycrg.data_service.service.gisogd;

import ru.mycrg.data_service.service.resources.ResourceQualifier;

public class GisogdData {

    private ResourceQualifier resourceQualifier;
    private Integer publishOrder;

    public GisogdData(ResourceQualifier resourceQualifier, Integer publishOrder) {
        this.resourceQualifier = resourceQualifier;
        this.publishOrder = publishOrder;
    }

    public ResourceQualifier getResourceQualifier() {
        return resourceQualifier;
    }

    public void setResourceQualifier(ResourceQualifier resourceQualifier) {
        this.resourceQualifier = resourceQualifier;
    }

    public Integer getPublishOrder() {
        return publishOrder;
    }

    public void setPublishOrder(Integer publishOrder) {
        this.publishOrder = publishOrder;
    }

    @Override
    public String toString() {
        return "{" +
                "\"resourceQualifier\":" + (resourceQualifier == null ? "null" : "\"" + resourceQualifier + "\"") + ", " +
                "\"publishOrder\":" + (publishOrder == null ? "null" : "\"" + publishOrder + "\"") +
                "}";
    }
}
