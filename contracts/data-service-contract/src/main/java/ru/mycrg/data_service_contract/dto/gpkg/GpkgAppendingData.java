package ru.mycrg.data_service_contract.dto.gpkg;

import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgStyle;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;
import ru.mycrg.gis_service_contract.dto.LayerProjection;

import java.io.Serializable;
import java.util.*;

//TODO: Пере_собрать/смотреть класс. Когда информации для экспорта было мало, всё было ок.
//  Теперь когда мы говорим в текущем ключе стоит сделать отдельные аппенды для каждого объекта

//Нужно стандартизировать этот класс и процесс вокруг него,
// нужно чтобы экспорт растров и вектора собирали бы эту DTO, то что не может собрать -> пусть пропускает
// а data-service уже пусть разбирается сам
public class GpkgAppendingData implements Serializable {

    //Нужен, чтобы доставать схему объектов
    private List<ExportResourceModel> resourceProjections = new ArrayList<>();

    private List<GpkgStyle> stylesAndSvgs = new ArrayList<>();

    private List<LayerProjection> layerProjections = new ArrayList<>();

    private Map<String, String> resourceAndPath = new HashMap<>();

    public GpkgAppendingData() {
        //req
    }

    public GpkgAppendingData(List<LayerProjection> layerProjections) {
        this.layerProjections = layerProjections == null ? new ArrayList<>() : layerProjections;
    }

    public List<ExportResourceModel> getResourceProjections() {
        return resourceProjections == null ? new ArrayList<>() : resourceProjections;
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
        return layerProjections == null ? new ArrayList<>() : layerProjections;
    }

    public void setLayerProjections(List<LayerProjection> layerProjections) {
        this.layerProjections = layerProjections != null ? layerProjections : new ArrayList<>();
    }

    public Map<String, String> getResourceAndPath() {
        return resourceAndPath == null ? new HashMap<>() : resourceAndPath;
    }

    public void setResourceAndPath(Map<String, String> resourceAndPath) {
        this.resourceAndPath = resourceAndPath == null ? new HashMap<>() : resourceAndPath;
    }

    @Override
    public String toString() {
        return "{" +
                "\"resourceProjections\":" + (resourceProjections == null ? "null" : Arrays.toString(
                resourceProjections.toArray())) + ", " +
                "\"stylesAndSvgs\":" + (stylesAndSvgs == null ? "null" : Arrays.toString(
                stylesAndSvgs.toArray())) + ", " +
                "\"layerProjections\":" + (layerProjections == null ? "null" : Arrays.toString(
                layerProjections.toArray())) + ", " +
                "\"resourceAndPath\":" + (resourceAndPath == null ? "null" : "\"" + resourceAndPath + "\"") +
                "}";
    }
}
