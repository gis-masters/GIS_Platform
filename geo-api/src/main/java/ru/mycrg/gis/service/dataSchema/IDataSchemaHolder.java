package ru.mycrg.gis.service.dataSchema;

import ru.mycrg.gis.dto.FeatureDescription;
import ru.mycrg.gis.dto.DataSchema;

import java.util.List;

public interface IDataSchemaHolder {

    List<FeatureDescription> getFewDescriptions(List<String> featureNames);

    FeatureDescription getDescriptionByName(String name);

    boolean isCacheEmpty();

}
