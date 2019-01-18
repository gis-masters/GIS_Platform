package ru.mycrg.gis.service.fgistp;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.gis.dto.fgistp.EntityType;
import ru.mycrg.gis.dto.fgistp.FgistpRules;
import ru.mycrg.gis.dto.fgistp.XsdSimpleType;
import ru.mycrg.gis.dto.fgistp.types.EnumerationProperty;
import ru.mycrg.gis.dto.fgistp.types.GeometryProperty;
import ru.mycrg.gis.dto.fgistp.types.SimplePropertyBase;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.mycrg.gis.dto.fgistp.ValueType.CHOICE;

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
                    .filter(SimplePropertyBase::isGeometry)
                    .count();

            if (geometryCounter > 1) {
                GeometryProperty newGeometryProperty = new GeometryProperty();

                List<SimplePropertyBase> properties = entityType.getProperties();
                List<String> geometries = new ArrayList<>();
                properties.stream()
                        .filter(SimplePropertyBase::isGeometry)
                        .forEach(propertyBase -> {
                            geometries.addAll(((GeometryProperty) propertyBase).getAllowedValues());
                        });

                properties.removeIf(SimplePropertyBase::isGeometry);

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

    private static void setPropertyTitle(Map<String, String> simpleType, SimplePropertyBase simpleProperty) {
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
