package ru.mycrg.acceptance.data_service.dto;

import java.util.ArrayList;
import java.util.List;

public class FeaturesCopyModel {

    private QualifierDto source;
    private QualifierDto target;
    private List<Integer> featureIds = new ArrayList<>();

    public FeaturesCopyModel(QualifierDto source, QualifierDto target, List<Integer> featureIds) {
        this.source = source;
        this.target = target;
        this.featureIds = featureIds;
    }

    public QualifierDto getSource() {
        return source;
    }

    public void setSource(QualifierDto source) {
        this.source = source;
    }

    public QualifierDto getTarget() {
        return target;
    }

    public void setTarget(QualifierDto target) {
        this.target = target;
    }

    public List<Integer> getFeatureIds() {
        return featureIds;
    }

    public void setFeatureIds(List<Integer> featureIds) {
        this.featureIds = featureIds;
    }
}
