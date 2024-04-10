package ru.mycrg.data_service.service.import_.dto;

import ru.mycrg.data_service.service.import_.model.FilePlacementPayloadModel;

public class GmlPlacementModel extends FilePlacementPayloadModel {

    private boolean invertedCoordinates;

    public GmlPlacementModel() {
        // Required
    }

    public boolean isInvertedCoordinates() {
        return invertedCoordinates;
    }

    public void setInvertedCoordinates(boolean invertedCoordinates) {
        this.invertedCoordinates = invertedCoordinates;
    }

    @Override
    public String toString() {
        return "{" +
                "\"invertedCoordinates\":\"" + invertedCoordinates + "\"" +
                "}";
    }
}
