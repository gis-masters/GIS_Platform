package ru.mycrg.data_service.mappers;

import ru.mycrg.data_service.dao.config.DaoProperties;
import ru.mycrg.geo_json.Feature;

import java.util.Map;

import static ru.mycrg.data_service.dao.config.DaoProperties.DEFAULT_GEOMETRY_COLUMN_NAME;

public class FeatureMapper {

    public static Feature map(Long id,
                              Feature oldFeature,
                              Map<String, Object> props) {
        Feature newFeature = new Feature(props);
        newFeature.setId(id);
        newFeature.setCrs(oldFeature.getCrs());
        newFeature.setSrs(oldFeature.getSrs());
        newFeature.setBbox(oldFeature.getBbox());
        newFeature.setGeometry(oldFeature.getGeometry());

        return newFeature;
    }

    public static Feature mapToFeature(Feature oldFeature,
                                       Map<String, Object> props) {
        if (props == null || props.isEmpty()) {
            return new Feature();
        }

        props.remove(DEFAULT_GEOMETRY_COLUMN_NAME);
        Object id = props.get(DaoProperties.PRIMARY_KEY);
        if (id == null) {
            id = props.get(DaoProperties.ID);
        }

        return map(Long.parseLong(id.toString()), oldFeature, props);
    }
}
