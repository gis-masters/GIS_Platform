package ru.mycrg.common;

import ru.mycrg.common.enums.RequestType;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class ValidationMqProcessRequest extends BaseMqProcessRequest {

    private int page = 0;
    private int size = 25;
    private List<ResourceProjection> resourceProjections = new ArrayList<>();
    private List<EntityTypeDto> features = new ArrayList<>();

    public ValidationMqProcessRequest() {}

    public ValidationMqProcessRequest(UUID id, RequestType type, int page, int size) {
        super(id, type);

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

    public void addFeatureProjections(EntityTypeDto featureProjection) {
        this.features.add(featureProjection);
    }

    public List<ResourceProjection> getResourceProjections() {
        return resourceProjections;
    }

    public void addResourceProjections(ResourceProjection resourceProjection) {
        this.resourceProjections.add(resourceProjection);
    }

    public List<EntityTypeDto> getFeatures() {
        return features;
    }

    public void setFeatures(List<EntityTypeDto> features) {
        this.features = features;
    }
}
