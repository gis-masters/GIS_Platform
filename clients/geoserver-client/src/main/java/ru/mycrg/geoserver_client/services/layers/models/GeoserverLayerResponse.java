package ru.mycrg.geoserver_client.services.layers.models;

public class GeoserverLayerResponse {
    private Layer layer;

    public GeoserverLayerResponse(Layer layer) {
        this.layer = layer;
    }

    public void setLayer(Layer layer) {
        this.layer = layer;
    }

    public Layer getLayer() {
        return layer;
    }
}
