package ru.mycrg.data_service_contract.dto.gpkg;

import ru.mycrg.data_service_contract.dto.ExportResourceModel;
import ru.mycrg.gis_service_contract.dto.LayerProjection;

import java.io.Serializable;
import java.util.LinkedList;
import java.util.List;

public class GpkgAppendingData implements Serializable {

    private List<ExportResourceModel> resourceProjections = new LinkedList<>();

    private List<StyleWithIcons> stylesAndSvgs = new LinkedList<>();

    private List<LayerProjection> layerProjections = new LinkedList<>();

    public GpkgAppendingData() {
        //req
    }

    public GpkgAppendingData(List<LayerProjection> layerProjections) {
        this.layerProjections = layerProjections;
    }

    public List<ExportResourceModel> getResourceProjections() {
        return resourceProjections;
    }

    public void setResourceProjections(List<ExportResourceModel> resourceProjections) {
        this.resourceProjections = resourceProjections != null ? resourceProjections : new LinkedList<>();
    }

    public List<StyleWithIcons> getStylesAndSvgs() {
        return stylesAndSvgs;
    }

    public void setStylesAndSvgs(List<StyleWithIcons> stylesAndSvgs) {
        this.stylesAndSvgs = stylesAndSvgs != null ? stylesAndSvgs : new LinkedList<>();
    }

    public List<LayerProjection> getLayerProjections() {
        return layerProjections;
    }

    public void setLayerProjections(List<LayerProjection> layerProjections) {
        this.layerProjections = layerProjections != null ? layerProjections : new LinkedList<>();
    }
}
