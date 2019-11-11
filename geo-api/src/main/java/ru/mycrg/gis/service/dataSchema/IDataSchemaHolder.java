package ru.mycrg.gis.service.dataSchema;

import ru.mycrg.common.FeatureDescriptionDto;

import java.util.List;
import java.util.Optional;

public interface IDataSchemaHolder {

    List<FeatureDescriptionDto> getFewDescriptions(List<String> featureNames);

    Optional<FeatureDescriptionDto> getDescriptionByName(String name);

    void update();

    boolean isCacheEmpty();
}
