package ru.mycrg.data_service.mappers;

import ru.mycrg.geo_json.Feature;

import java.util.Map;

public class FeatureMapper {

    public static Feature map(Feature oldFeature, Map<String, Object> props) {
        Feature modifiedFeature = new Feature(props);
        modifiedFeature.setId(oldFeature.getId());
        modifiedFeature.setCrs(oldFeature.getCrs());
        modifiedFeature.setSrs(oldFeature.getSrs());
        modifiedFeature.setBbox(oldFeature.getBbox());
        modifiedFeature.setGeometry(oldFeature.getGeometry());

        return modifiedFeature;
    }
}
