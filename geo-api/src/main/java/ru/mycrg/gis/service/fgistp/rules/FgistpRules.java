package ru.mycrg.gis.service.fgistp.rules;

import ru.mycrg.gis.service.fgistp.EntityType;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class FgistpRules {

    private List<EntityType> entityTypes = new ArrayList<>();

    public FgistpRules() {}

    public FgistpRules(List<EntityType> entityTypes) {
        this.entityTypes = entityTypes;
    }

    public void addComplexType(EntityType entityType) {
        entityTypes.add(entityType);
    }

    public List<EntityType> getEntityTypes() {
        return entityTypes;
    }

    public void setEntityTypes(List<EntityType> entityTypes) {
        this.entityTypes = entityTypes;
    }

    /**
     * Ищет фичу и по name и по originName
     *
     * @param name Название фичи
     */
    public Optional<EntityType> getFeatureTypeByName(String name) {
        // Find By Name
        Optional<EntityType> directComparisonByName = entityTypes.stream()
                .filter(featureType -> featureType.getName().toLowerCase().equals(name.toLowerCase()))
                .findFirst();

        if (directComparisonByName.isPresent()) {
            return directComparisonByName;
        }

        // Find By originName
        Optional<EntityType> directComparisonByOriginName = entityTypes.stream()
                .filter(featureType -> featureType.getOriginName().toLowerCase().equals(name.toLowerCase()))
                .findFirst();

        if (directComparisonByOriginName.isPresent()) {
            return directComparisonByOriginName;
        }

        return entityTypes.stream()
                .filter(featureType -> findFeatureAdvance(name, featureType))
                .findFirst();
    }

    private boolean findFeatureAdvance(String featureName, EntityType featureType) {
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
