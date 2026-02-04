package ru.mycrg.data_service_contract.dto.gpkg;

import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgStyle;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;
import ru.mycrg.gis_service_contract.dto.LayerProjection;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

//TODO: Пере_собрать/смотреть класс. Когда информации для экспорта было мало, всё было ок.
//  Теперь когда мы говорим в текущем ключе стоит сделать отдельные аппенды для каждого объекта
public class GpkgAppendingData implements Serializable {

    //Нужен, чтобы доставать схему объектов
    private List<ExportResourceModel> resourceProjections = new ArrayList<>();

    private List<GpkgStyle> stylesAndSvgs = new ArrayList<>();

    private List<LayerProjection> layerProjections = new ArrayList<>();

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
        this.resourceProjections = resourceProjections != null ? resourceProjections : new ArrayList<>();
    }

    public List<GpkgStyle> getStylesAndSvgs() {
        return stylesAndSvgs;
    }

    public void setStylesAndSvgs(List<GpkgStyle> stylesAndSvgs) {
        this.stylesAndSvgs = stylesAndSvgs != null ? stylesAndSvgs : new ArrayList<>();
    }

    public List<LayerProjection> getLayerProjections() {
        return layerProjections;
    }

    public void setLayerProjections(List<LayerProjection> layerProjections) {
        this.layerProjections = layerProjections != null ? layerProjections : new ArrayList<>();
    }
}
