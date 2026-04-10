package ru.mycrg.data_service_client.mappers;

import ru.mycrg.data_service_client.dto.SimplifiedFeatureResponse;
import ru.mycrg.geo_json.Feature;

import java.util.List;
import java.util.stream.Collectors;

public class SimplifiedFeatureMapper {

    public static Feature toFeature(SimplifiedFeatureResponse response) {
        if (response == null) {
            return null;
        }

        Feature feature = new Feature();
        feature.setId(response.getId());
        feature.setProperties(response.getProperties());
        feature.setGeometry(null);

        return feature;
    }

    public static List<Feature> toFeatures(List<SimplifiedFeatureResponse> responses) {
        if (responses == null) {
            return null;
        }

        return responses.stream()
                        .map(SimplifiedFeatureMapper::toFeature)
                        .collect(Collectors.toList());
    }
}
