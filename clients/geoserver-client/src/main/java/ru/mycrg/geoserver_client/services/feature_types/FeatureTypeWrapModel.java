package ru.mycrg.geoserver_client.services.feature_types;

import ru.mycrg.geoserver_client.contracts.featuretypes.FeatureTypeModel;

public class FeatureTypeWrapModel {

    public final FeatureTypeModel featureType;

    public FeatureTypeWrapModel(FeatureTypeModel featureType) {
        this.featureType = featureType;
    }

    public FeatureTypeModel getFeatureType() {
        return featureType;
    }
}
