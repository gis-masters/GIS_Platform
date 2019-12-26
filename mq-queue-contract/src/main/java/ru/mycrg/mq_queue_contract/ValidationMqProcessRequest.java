package ru.mycrg.mq_queue_contract;

import java.util.ArrayList;
import java.util.List;

public class ValidationMqProcessRequest {

    private int page = 0;
    private int size = 25;
    private List<ResourceProjection> resourceProjections = new ArrayList<>();
    private List<SchemaDto> features = new ArrayList<>();

    public ValidationMqProcessRequest() {}

    public ValidationMqProcessRequest(int page, int size) {
        this.page = page;
        this.size = size;
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public void addFeatureProjections(SchemaDto featureProjection) {
        this.features.add(featureProjection);
    }

    public List<ResourceProjection> getResourceProjections() {
        return resourceProjections;
    }

    public void addResourceProjections(ResourceProjection resourceProjection) {
        this.resourceProjections.add(resourceProjection);
    }

    public List<SchemaDto> getFeatures() {
        return features;
    }

    public void setFeatures(List<SchemaDto> features) {
        this.features = features;
    }
}
