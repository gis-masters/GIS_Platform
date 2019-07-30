package ru.mycrg.gis.service.fgistp.rules;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;
import ru.mycrg.common.propertyTypes.AbstractProperty;
import ru.mycrg.common.propertyTypes.GeometryProperty;
import ru.mycrg.gis.exceptions.CrgFailedException;
import ru.mycrg.gis.exceptions.CrgNotFoundException;
import ru.mycrg.gis.repository.CustomRuleRepository;
import ru.mycrg.gis.repository.XsdRuleRepository;
import ru.mycrg.gis.service.fgistp.FeatureDescription;
import ru.mycrg.gis.service.fgistp.MapperUtil;
import ru.mycrg.gis.service.fgistp.parser.ClassDefinitionParser;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Обрабатывает и содержит правила ФГИС ТП: <p>
 * Правила состоят из: <p>
 * - Правила полученные из xsd схемы <p>
 * - Наши правила, заданные вручную
 */
@Service
public class FgistpRuleService implements IFgistpRuleHandler, IFgistpRuleHolder {

    private static Logger log = LoggerFactory.getLogger(FgistpRuleService.class);

    private final String DEFAULT_XSD_SCHEMA_PATH = "/opt/fgistp/fgistp.xsd";

    private FgistpRules fgistpRules = new FgistpRules();

    private final ClassDefinitionParser parser;
    private final XsdRuleRepository xsdRuleRepository;
    private final CustomRuleRepository customRuleRepository;

    @Autowired
    public FgistpRuleService(ClassDefinitionParser parser,
                             CustomRuleRepository customRuleRepository,
                             XsdRuleRepository xsdRuleRepository) {
        this.parser = parser;
        this.xsdRuleRepository = xsdRuleRepository;
        this.customRuleRepository = customRuleRepository;
    }

    @Override
    public FgistpRules loadRulesFromXsdSchema(String path) {
        log.info("Try load rules from XsdSchema: {}", path);

        try {
            File file = ResourceUtils.getFile(DEFAULT_XSD_SCHEMA_PATH);

            FgistpRules rules = parser.parse(file);
            fgistpRules = splitRulesByGeometry(rules);

            if (isIdenticalNamesExist(fgistpRules)) {
                log.error("Exist identical feature names. Something wrong via generate rules.");
            }

            persistXsdRules(fgistpRules);
        } catch (FileNotFoundException e) {
            log.error("Not found xsd schema file by path: {} / {}", path, e.getLocalizedMessage());
        } catch (Exception e) {
            e.printStackTrace();
            log.error("Failed load rules: {}", e.getMessage());
        }

        return fgistpRules;
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
    public FgistpRules splitRulesByGeometry(FgistpRules rules) {
        FgistpRules newRules = new FgistpRules();

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
                        case "Polygon":     newRules.addComplexType(prepareNewFeature(featureDescription, "Polygon")); break;
                        case "Point":       newRules.addComplexType(prepareNewFeature(featureDescription, "Point")); break;
                        case "LineString":  newRules.addComplexType(prepareNewFeature(featureDescription, "LineString")); break;
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
    public FgistpRules loadRulesFromXsdSchema() {
        return loadRulesFromXsdSchema(DEFAULT_XSD_SCHEMA_PATH);
    }

    public FgistpRules updateRules() {
        log.info("Update rules");

        fgistpRules.setFeatureDescriptions(new ArrayList<>());

        try {
            if (isXsdRulesEmpty()) {
                loadRulesFromXsdSchema();
            }

            getRulesFromDb();
            imposeCustomRules();
        } catch (Exception e) {
            log.error("Failed update rules. {}", e.getMessage());
            throw new CrgFailedException("Failed update rules. " + e.getLocalizedMessage());
        }

        return fgistpRules;
    }

    public FgistpRules getAllRules() {
        return fgistpRules;
    }

    public List<FeatureDescription> getFewRules(List<String> featureNames) {
        return fgistpRules
                .getFeatureDescriptions().stream()
                .filter(fDescription -> featureNames.contains(fDescription.getName()))
                .collect(Collectors.toList());
    }

    /**
     * Возвращает описание фичи.
     *
     * @param featureName Название фичи(Слоя)
     * @return Описание фичи {@link FeatureDescription}
     * @throws CrgNotFoundException 404 если не нашли название фичи.
     */
    public FeatureDescription getRuleByName(String featureName) throws CrgNotFoundException {
        Optional<FeatureDescription> optionalFeature = fgistpRules.getFeatureTypeByName(featureName);
        if (optionalFeature.isPresent()) {
            FeatureDescription featureDescription = optionalFeature.get();
            customRuleRepository
                    .findCustomRuleByClassName(featureDescription.getName())
                    .ifPresent(customRule -> featureDescription.setCustomRuleFunction(customRule.getClassRule()));

            return featureDescription;
        } else {
            throw new CrgNotFoundException("Не найден слой: " + featureName);
        }
    }

    /**
     * Проверяем наличие фичи по названию.
     * @param featureName Название фичи(Слоя)
     * @throws CrgNotFoundException
     */
    public void checkFeatureByName(String featureName) throws CrgNotFoundException {
        fgistpRules
                .getFeatureTypeByName(featureName)
                .orElseThrow(() -> new CrgNotFoundException("Не найден слой: " + featureName));
    }

    @Override
    public boolean isXsdRulesEmpty() {
        return xsdRuleRepository.count() == 0;
    }

    @Override
    public boolean isCacheEmpty() {
        return fgistpRules.getFeatureDescriptions().isEmpty();
    }

    /**
     * Не должно быть повторяющихся имен фич. (Поскольку имя фичи это название таблицы)
     */
    private boolean isIdenticalNamesExist(FgistpRules fgistpRules) {
        long count = fgistpRules.getFeatureDescriptions().stream()
                .map(FeatureDescription::getName)
                .distinct()
                .count();

        return count != fgistpRules.getFeatureDescriptions().size();
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

    private void persistXsdRules(FgistpRules rules) {
        rules
                .getFeatureDescriptions()
                .forEach(classType -> xsdRuleRepository.save(MapperUtil.mapFeatureDescriptionToXsdRule(classType)));
    }

    private void getRulesFromDb() {
        log.info("Get rules from DB");

        List<FeatureDescription> featureDescriptions = fgistpRules.getFeatureDescriptions();

        xsdRuleRepository
                .findAll()
                .forEach(xsdRule -> featureDescriptions.add(MapperUtil.mapXsdRuleToFeatureDescription(xsdRule)));
    }

    /**
     * Накладываем поверх сгенерированных правил, правила установленные вручную.
     */
    private void imposeCustomRules() {
        log.warn("ImposeCustomRules");

        customRuleRepository
                .findAll()
                .forEach(customRule -> {
                    String className = customRule.getClassName();

                    fgistpRules.getFeatureDescriptions()
                            .stream()
                            .filter(featureDescription -> className.equals(featureDescription.getName()))
                            .forEach(featureDescription -> featureDescription.setCustomRuleFunction(customRule.getClassRule()));
                });
    }
}
