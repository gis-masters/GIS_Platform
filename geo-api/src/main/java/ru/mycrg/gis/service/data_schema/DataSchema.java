package ru.mycrg.gis.service.data_schema;

import ru.mycrg.mq_queue_contract.SchemaDto;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class DataSchema {

    private List<SchemaDto> schemas = new ArrayList<>();

    public DataSchema() {}

    public void addSchema(SchemaDto featureDescription) {
        schemas.add(featureDescription);
    }

    public List<SchemaDto> getSchemas() {
        return schemas;
    }

    public void clear() {
        schemas.clear();
    }

    /**
     * Ищем схему и по name и по originName
     *
     * @param name Название схемы
     */
    public Optional<SchemaDto> getSchemaByName(String name) {
        // Find By Name
        Optional<SchemaDto> directComparisonByName = schemas.stream()
                .filter(schemaDto -> schemaDto.getName().equalsIgnoreCase(name))
                .findFirst();

        if (directComparisonByName.isPresent()) {
            return directComparisonByName;
        }

        // Find By originName
        Optional<SchemaDto> directComparisonByOriginName = schemas.stream()
                .filter(featureType -> featureType.getOriginName().equalsIgnoreCase(name))
                .findFirst();

        if (directComparisonByOriginName.isPresent()) {
            return directComparisonByOriginName;
        }

        return schemas.stream()
                .filter(featureType -> findSchemaAdvance(name, featureType))
                .findFirst();
    }

    private boolean findSchemaAdvance(String featureName, SchemaDto featureType) {
        String targetName = featureType.getName().toLowerCase();

        if (targetName.contains(featureName.toLowerCase())) {
            return true;
        }

        if (featureName.contains("_")) {
            String[] splitted = featureName.split("_");

            String sName = splitted[0];
            if (sName != null) {
                return targetName.contains(sName.toLowerCase());
            }
        }

        return false;
    }

}
