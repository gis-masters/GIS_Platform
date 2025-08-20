package ru.mycrg.data_service_contract.dto;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

public class FeaturesCopyModel {

    @Valid
    @NotNull
    private ResourceQualifierDto source;

    @Valid
    @NotNull
    private ResourceQualifierDto target;

    @NotEmpty
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
