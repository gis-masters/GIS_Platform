package ru.mycrg.common_contracts.generated.data_service.gpkg;

import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTile;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class GpkgLayersPlacementModel {

    private List<GpkgTile> rasterLayers = new ArrayList<>();
    private List<String> vectorLayers = new ArrayList<>();

    public GpkgLayersPlacementModel() {
        //Req
    }

    public GpkgLayersPlacementModel(List<GpkgTile> rasterLayers, List<String> vectorLayers) {
        this.rasterLayers = rasterLayers;
        this.vectorLayers = vectorLayers;
    }

    public List<GpkgTile> getRasterLayers() {
        return rasterLayers == null ? new ArrayList<>() : rasterLayers;
    }

    public void setRasterLayers(List<GpkgTile> rasterLayers) {
        this.rasterLayers = rasterLayers;
    }

    public List<String> getVectorLayers() {
        return vectorLayers == null ? new ArrayList<>() : vectorLayers;
    }

    public void setVectorLayers(List<String> vectorLayers) {
        this.vectorLayers = vectorLayers;
    }

    @Override
    public String toString() {
        return "{" +
                "\"rasterLayers\":" + (rasterLayers == null ? "null" : Arrays.toString(rasterLayers.toArray())) + ", " +
                "\"vectorLayers\":" + (vectorLayers == null ? "null" : Arrays.toString(vectorLayers.toArray())) +
                "}";
    }
}
