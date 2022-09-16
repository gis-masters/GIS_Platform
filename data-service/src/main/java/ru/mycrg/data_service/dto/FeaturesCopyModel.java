package ru.mycrg.data_service.dto;

import java.util.ArrayList;
import java.util.List;

public class FeaturesCopyModel {

    private ResourceQualifierDto source;
    private ResourceQualifierDto target;
    private List<Long> featureIds = new ArrayList<>();

    public FeaturesCopyModel() {
        //Required
    }

    public List<Long> getFeatureIds() {
        return featureIds;
    }

    public void setFeatureIds(List<Long> featureIds) {
        this.featureIds = featureIds;
    }

    public ResourceQualifierDto getSource() {
        return source;
    }

    public void setSource(ResourceQualifierDto source) {
        this.source = source;
    }

    public ResourceQualifierDto getTarget() {
        return target;
    }

    public void setTarget(ResourceQualifierDto target) {
        this.target = target;
    }
}
