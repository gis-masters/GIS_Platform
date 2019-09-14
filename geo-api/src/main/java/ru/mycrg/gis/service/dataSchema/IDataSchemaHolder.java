package ru.mycrg.gis.service.dataSchema;

import ru.mycrg.common.FeatureDescriptionDto;

import java.util.List;

public interface IDataSchemaHolder {

    List<FeatureDescriptionDto> getFewDescriptions(List<String> featureNames);

    FeatureDescriptionDto getDescriptionByName(String name);

    void update();

    boolean isCacheEmpty();
}
