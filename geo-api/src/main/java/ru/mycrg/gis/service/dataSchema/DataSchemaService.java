package ru.mycrg.gis.service.dataSchema;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.FeatureDescriptionDto;
import ru.mycrg.common.propertyTypes.AbstractProperty;
import ru.mycrg.common.propertyTypes.GeometryProperty;
import ru.mycrg.gis.dto.DataSchema;
import ru.mycrg.gis.dto.FeatureDescription;
import ru.mycrg.gis.exceptions.CrgNotFoundException;
import ru.mycrg.gis.repository.CustomFeatureDefinitionRepository;
import ru.mycrg.gis.repository.DataSchemaRepository;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Сервис схемм данных.
 * Правила состоят из: <p>
 * - Правила полученные из xsd схемы <p>
 * - Наши правила, заданные вручную
 */
@Service
public class DataSchemaService implements IDataSchemaHolder {

    private static Logger log = LoggerFactory.getLogger(DataSchemaService.class);

    private DataSchema dataSchema = new DataSchema();

    private final DataSchemaRepository dataSchemaRepository;
    private final CustomFeatureDefinitionRepository customFeatureDefinitionRepository;

    @Autowired
    public DataSchemaService(CustomFeatureDefinitionRepository customFeatureDefinitionRepository,
                             DataSchemaRepository dataSchemaRepository) {
        this.dataSchemaRepository = dataSchemaRepository;
        this.customFeatureDefinitionRepository = customFeatureDefinitionRepository;
    }

    public List<FeatureDescriptionDto> getFewDescriptions(List<String> featureNames) {
        if (isCacheEmpty()) {
            prepareSchema();
        }

        if (featureNames.isEmpty()) {
            return dataSchema
                    .getFeatureDescriptions().stream()
                    .map(MapperUtil::mapFeatureDescriptionToDto)
                    .collect(Collectors.toList());
        } else {
            return dataSchema
                    .getFeatureDescriptions().stream()
                    .filter(fDescription -> featureNames.contains(fDescription.getName()))
                    .map(MapperUtil::mapFeatureDescriptionToDto)
                    .collect(Collectors.toList());
        }
    }

    /**
     * Возвращает описание фичи.
     *
     * @param featureName Название фичи(Слоя)
     * @return Описание фичи {@link ru.mycrg.common.FeatureDescriptionDto}
     * @throws CrgNotFoundException 404 если не нашли название фичи.
     */
    public FeatureDescriptionDto getDescriptionByName(String featureName) throws CrgNotFoundException {
        if (dataSchema.getFeatureDescriptions().isEmpty()) {
            prepareSchema();
        }

        Optional<FeatureDescription> optionalFeature = dataSchema.getFeatureTypeByName(featureName);
        if (optionalFeature.isPresent()) {
            FeatureDescription featureDescription = optionalFeature.get();
            customFeatureDefinitionRepository
                    .findDefinitionByClassName(featureDescription.getName())
                    .ifPresent(customRule -> featureDescription.setCustomRuleFunction(customRule.getClassRule()));

            return MapperUtil.mapFeatureDescriptionToDto(featureDescription);
        } else {
            throw new CrgNotFoundException("Не найден слой: " + featureName);
        }
    }

    /**
     * Описание полученное из схемы, приводится к соответствию с шаблонной БД, в которой геометрии фичи разложены по
     * отдельным таблицам. <p>
     * Например: <br>
     *     NaturalRiskZone_Type имеет два вида геометрии Polygon и Point,
     *     а в БД соответственно должно быть две таблицы: <br>
     *     naturalriskzone(как Polygon) и naturalriskzone_point(как Point)
     * @param rules Правила полученные после парсинга fgistp.xsd
     * @return Правила приведенные в соответствие к шаблонной структуре БД.
     */
    public DataSchema splitRulesByGeometry(DataSchema rules) {
        DataSchema newRules = new DataSchema();

        rules.getFeatureDescriptions().forEach(featureDescription -> {
            Optional<GeometryProperty> optionalProperty = featureDescription.getProperties().stream()
                    .filter(AbstractProperty::isGeometry)
                    .findFirst()
                    .map(property -> (GeometryProperty) property);

            if (optionalProperty.isPresent()) {
                GeometryProperty geomProperty = optionalProperty.get();

                geomProperty.getAllowedValues().forEach(geomType -> {
                    switch (geomType) {
                        case "Curve": break; // Do nothing
                        case "Polygon":     newRules.addFeatureDescription(prepareNewFeature(featureDescription, "Polygon")); break;
                        case "Point":       newRules.addFeatureDescription(prepareNewFeature(featureDescription, "Point")); break;
                        case "LineString":  newRules.addFeatureDescription(prepareNewFeature(featureDescription, "LineString")); break;
                        default:
                            log.warn("Unsupported geometry type: {}", geomType);
                    }
                });
            } else {
                log.warn("Some feature not contain geometry? {}", featureDescription.getName());
            }
        });

        return newRules;
    }

    @Override
    public boolean isCacheEmpty() {
        return dataSchema.getFeatureDescriptions().isEmpty();
    }

    /**
     * Проверяем наличие фичи по названию.
     * @param featureName Название фичи(Слоя)
     * @throws CrgNotFoundException
     */
    public void checkFeatureByName(String featureName) throws CrgNotFoundException {
        if (dataSchema.getFeatureDescriptions().isEmpty()) {
            prepareSchema();
        }

        dataSchema
                .getFeatureTypeByName(featureName)
                .orElseThrow(() -> new CrgNotFoundException("Не найден слой: " + featureName));
    }

    /**
     * Новая фича это копия старой с новым именем и названием таблицы, а также с отредактированным свойством
     * геометрии, в котором отсается только одно значение.
     */
    private FeatureDescription prepareNewFeature(FeatureDescription featureDescription, String geometryType) {
        FeatureDescription newFeature = new FeatureDescription(featureDescription);

        List<AbstractProperty> newProperties = new ArrayList<>();
        featureDescription.getProperties().forEach(property -> {
            if (property.isGeometry()) {
                GeometryProperty newGeometry = new GeometryProperty((GeometryProperty) property);
                newGeometry.setAllowedValues(Collections.singletonList(geometryType));

                newProperties.add(newGeometry);
            } else {
                newProperties.add(property);
            }
        });

        newFeature.setProperties(newProperties);

        if ("Polygon".equals(geometryType)) {
            newFeature.setTableName(featureDescription.getTableName());
        } else if ("LineString".equals(geometryType)) {
            newFeature.setTableName(featureDescription.getTableName() + "_line");
        } else if ("Point".equals(geometryType)) {
            newFeature.setTableName(featureDescription.getTableName() + "_point");
        } else {
            newFeature.setTableName(featureDescription.getTableName());
        }

        newFeature.setName(newFeature.getTableName());
        return newFeature;
    }

    /**
     * Накладываем поверх сгенерированных правил, правила установленные вручную.
     */
    private void imposeCustomRules(DataSchema dataSchema) {
        log.warn("ImposeCustomRules");

        customFeatureDefinitionRepository
                .findAll()
                .forEach(customRule -> {
                    String className = customRule.getClassName();

                    dataSchema.getFeatureDescriptions()
                              .stream()
                              .filter(featureDescription -> className.equals(featureDescription.getName()))
                              .forEach(featureDescription -> featureDescription.setCustomRuleFunction(customRule.getClassRule()));
                });
    }

    private void prepareSchema() {
        log.info("Cache dataSchema");

        if (isCacheEmpty()) {
            dataSchemaRepository
                    .findAll()
                    .forEach(xsdRule -> dataSchema.addFeatureDescription(MapperUtil.mapXsdRuleToFeatureDescription(xsdRule)));

            imposeCustomRules(dataSchema);
        }
    }

}
