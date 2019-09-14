package ru.mycrg.gis.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class DataSchema {

    private List<FeatureDescription> featureDescriptions = new ArrayList<>();

    public DataSchema() {}

    public void addFeatureDescription(FeatureDescription featureDescription) {
        featureDescriptions.add(featureDescription);
    }

    public List<FeatureDescription> getFeatureDescriptions() {
        return featureDescriptions;
    }

    public void clear() {
        featureDescriptions.clear();
    }

    /**
     * Ищет фичу и по name и по originName
     *
     * @param name Название фичи
     */
    public Optional<FeatureDescription> getFeatureTypeByName(String name) {
        // Find By Name
        Optional<FeatureDescription> directComparisonByName = featureDescriptions.stream()
                .filter(featureType -> featureType.getName().toLowerCase().equals(name.toLowerCase()))
                .findFirst();

        if (directComparisonByName.isPresent()) {
            return directComparisonByName;
        }

        // Find By originName
        Optional<FeatureDescription> directComparisonByOriginName = featureDescriptions.stream()
                .filter(featureType -> featureType.getOriginName().toLowerCase().equals(name.toLowerCase()))
                .findFirst();

        if (directComparisonByOriginName.isPresent()) {
            return directComparisonByOriginName;
        }

        return featureDescriptions.stream()
                .filter(featureType -> findFeatureAdvance(name, featureType))
                .findFirst();
    }

    private boolean findFeatureAdvance(String featureName, FeatureDescription featureType) {
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
