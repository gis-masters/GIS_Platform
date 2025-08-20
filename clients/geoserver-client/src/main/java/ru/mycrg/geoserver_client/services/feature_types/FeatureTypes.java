package ru.mycrg.geoserver_client.services.feature_types;

import ru.mycrg.geoserver_client.contracts.NameHrefProjection;

import java.util.ArrayList;
import java.util.List;

public class FeatureTypes {

    private List<NameHrefProjection> featureType = new ArrayList<>();

    public List<NameHrefProjection> getFeatureType() {
        return featureType;
    }

    public void setFeatureType(List<NameHrefProjection> featureType) {
        this.featureType = featureType;
    }
}
