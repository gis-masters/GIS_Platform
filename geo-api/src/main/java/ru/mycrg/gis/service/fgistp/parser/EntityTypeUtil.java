package ru.mycrg.gis.service.fgistp.parser;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.gis.service.fgistp.EntityType;
import ru.mycrg.common.propertyTypes.AbstractProperty;
import ru.mycrg.common.propertyTypes.EnumerationProperty;
import ru.mycrg.common.propertyTypes.GeometryProperty;
import ru.mycrg.gis.service.fgistp.rules.FgistpRules;

import java.util.*;

import static ru.mycrg.common.enums.ValueType.CHOICE;

public class EntityTypeUtil {

    private static Logger log = LoggerFactory.getLogger(EntityTypeUtil.class);

    /**
     * Разделим title вида: Класс объектов «Функциональные зоны» <p>
     * на:
     * title: Функциональные зоны <p>
     * Description: Класс объектов «Функциональные зоны»
     * @param entityTypes
     */
    public static void fillDescription(List<EntityType> entityTypes) {
        entityTypes.forEach(entityType -> {
            String originTitle = entityType.getTitle();
            if (originTitle != null) {
                String[] split = originTitle.split("«");
                if (split.length > 1) {
                    String newTitle = split[1];
                    entityType.setTitle(newTitle.substring(0, newTitle.length() - 1));
                }
            }

            entityType.setDescription(originTitle);
        });
    }

    public static void addDbTableName(List<EntityType> entityTypes) {
        entityTypes.forEach(entityType -> {
            String tableName = null;
            try {
                tableName = entityType.getName().split("_")[0].toLowerCase();
            } catch (Exception e) {
                log.warn("Неудалось преобразовать имя типа в имя таблицы БД");
            }

            entityType.setTableName(tableName);
        });
    }

    public static void joinGeometry(List<EntityType> entityTypes) {
        entityTypes.forEach(entityType -> {
            long geometryCounter = entityType.getProperties().stream()
                    .filter(AbstractProperty::isGeometry)
                    .count();

            if (geometryCounter > 1) {
                GeometryProperty newGeometryProperty = new GeometryProperty();

                Set<AbstractProperty> properties = entityType.getProperties();
                List<String> geometries = new ArrayList<>();
                properties.stream()
                        .filter(AbstractProperty::isGeometry)
                        .forEach(propertyBase -> {
                            geometries.addAll(((GeometryProperty) propertyBase).getAllowedValues());
                        });

                properties.removeIf(AbstractProperty::isGeometry);

                newGeometryProperty.setAllowedValues(geometries);

                entityType.addProperty(newGeometryProperty);
            }
        });
    }

    public static void addEnumerationAlias(FgistpRules fgistpRules, List<XsdSimpleType> xsdSimpleTypes) {
        fgistpRules.getEntityTypes()
                .forEach(entityType -> {
                    String typeName = entityType.getName();
                    entityType.getProperties()
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
