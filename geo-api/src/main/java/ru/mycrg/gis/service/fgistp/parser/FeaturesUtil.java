package ru.mycrg.gis.service.fgistp.parser;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.gis.service.fgistp.FeatureDescription;
import ru.mycrg.common.propertyTypes.AbstractProperty;
import ru.mycrg.common.propertyTypes.EnumerationProperty;
import ru.mycrg.common.propertyTypes.GeometryProperty;
import ru.mycrg.gis.service.fgistp.rules.FgistpRules;

import java.util.*;

import static ru.mycrg.common.enums.ValueType.CHOICE;

public class FeaturesUtil {

    private static Logger log = LoggerFactory.getLogger(FeaturesUtil.class);

    public static String removePostfix(@NotNull String name) {
        if (!name.contains("_")) {
            return name;
        }

        String[] splited = name.split("_");

        if (splited[0] != null) {
            return splited[0];
        }

        return name;
    }

    /**
     * Разделим title вида: Класс объектов «Функциональные зоны» <p>
     * на:
     * title: Функциональные зоны <p>
     * Description: Класс объектов «Функциональные зоны»
     * @param fDescriptions
     */
    public static void fillDescription(List<FeatureDescription> fDescriptions) {
        fDescriptions.forEach(featureDescription -> {
            String originTitle = featureDescription.getTitle();
            if (originTitle != null) {
                String[] split = originTitle.split("«");
                if (split.length > 1) {
                    String newTitle = split[1];
                    featureDescription.setTitle(newTitle.substring(0, newTitle.length() - 1));
                }
            }

            featureDescription.setDescription(originTitle);
        });
    }

    public static void joinGeometry(List<FeatureDescription> fDescriptions) {
        fDescriptions.forEach(featureDescription -> {
            long geometryCounter = featureDescription.getProperties().stream()
                    .filter(AbstractProperty::isGeometry)
                    .count();

            if (geometryCounter > 1) {
                GeometryProperty newGeometryProperty = new GeometryProperty();

                List<AbstractProperty> properties = featureDescription.getProperties();
                List<String> geometries = new ArrayList<>();
                properties.stream()
                        .filter(AbstractProperty::isGeometry)
                        .forEach(propertyBase -> {
                            geometries.addAll(((GeometryProperty) propertyBase).getAllowedValues());
                        });

                properties.removeIf(AbstractProperty::isGeometry);

                int sequenceNumber = properties.stream()
                        .max(Comparator.comparingInt(AbstractProperty::getSequenceNumber))
                        .get()
                        .getSequenceNumber();

                newGeometryProperty.setAllowedValues(geometries);
                newGeometryProperty.setSequenceNumber(sequenceNumber + 1);

                featureDescription.addProperty(newGeometryProperty);
            }
        });
    }

    public static void addEnumerationAlias(FgistpRules fgistpRules, List<XsdSimpleType> xsdSimpleTypes) {
        fgistpRules.getFeatureDescriptions()
                .forEach(featureDescription -> {
                    String typeName = featureDescription.getName();
                    featureDescription.getProperties()
                            .forEach(simpleProperty -> {
                                // В описание, на предыдущем шаге, я ложил название типа...
                                String propertyName = simpleProperty.getDescription();

                                getXsdSimpleTypeByName(xsdSimpleTypes, propertyName)
                                        .ifPresent(simpleType -> setPropertyTitle(simpleType.getProperties(), simpleProperty));

                                // Приведем в порядок описание
                                simpleProperty.setDescription("");
                            });
                });
    }

    private static Optional<XsdSimpleType> getXsdSimpleTypeByName(List<XsdSimpleType> simpleTypes, String propertyName) {
        return simpleTypes.stream()
                .filter(simpleType -> simpleType.getName().equals(propertyName))
                .findFirst();
    }

    private static void setPropertyTitle(Map<String, String> simpleType, AbstractProperty simpleProperty) {
        if (simpleProperty.getValueType() == CHOICE) {
            EnumerationProperty property = (EnumerationProperty) simpleProperty;
            property.getEnumerations()
                    .forEach(valueAliasProjection -> {
                        String alias = simpleType.get(valueAliasProjection.getValue());
                        valueAliasProjection.setTitle(alias);
                    });
        } else {
            log.warn("--- {}", simpleProperty.getName());
        }
    }

}
