package ru.mycrg.data_service.service.aop;

import ru.mycrg.geo_json.Feature;

public class FollowUpData {

    private Feature feature;

    public FollowUpData(Feature feature) {
        this.feature = feature;
    }

    public Feature getFeature() {
        return feature;
    }

    public void setFeature(Feature feature) {
        this.feature = feature;
    }
}
