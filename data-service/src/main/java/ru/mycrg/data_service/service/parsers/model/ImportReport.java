package ru.mycrg.data_service.service.parsers.model;

import java.util.ArrayList;
import java.util.List;

public class ImportReport {

    private String datasetName;
    private List<LayerReport> layers = new ArrayList<>();

    public ImportReport(String datasetName) {
        this.datasetName = datasetName;
    }

    public String getDatasetName() {
        return datasetName;
    }

    public void setDatasetName(String datasetName) {
        this.datasetName = datasetName;
    }

    public List<LayerReport> getLayers() {
        return layers;
    }

    public void setLayers(List<LayerReport> layers) {
        this.layers = layers;
    }

    public void addLayer(LayerReport layerReport) {
        layers.add(layerReport);
    }
}
