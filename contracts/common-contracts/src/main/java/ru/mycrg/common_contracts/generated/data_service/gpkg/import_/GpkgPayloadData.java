package ru.mycrg.common_contracts.generated.data_service.gpkg.import_;

import ru.mycrg.common_contracts.generated.data_service.gpkg.contents.GpkgContentsBaseDto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class GpkgPayloadData implements Serializable {

    private List<GpkgContentsBaseDto> gpkgContents = new ArrayList<>();

    private GpkgWrapperImportReport wrapperImportReport;

    private GpkgImportDestinationProject project;
    private List<GpkgTile> tiles = new ArrayList<>();
    private List<GpkgTable> tables = new ArrayList<>();
    private List<GpkgLayer> layers = new ArrayList<>();
    private List<GpkgStyle> styles = new ArrayList<>();
    private List<GpkgFile> files = new ArrayList<>();

    public GpkgPayloadData() {
        //Req
    }

    public List<GpkgContentsBaseDto> getGpkgContents() {
        return gpkgContents == null ? new ArrayList<>() : gpkgContents;
    }

    public void setGpkgContents(List<GpkgContentsBaseDto> gpkgContents) {
        this.gpkgContents = gpkgContents == null ? new ArrayList<>() : gpkgContents;
    }

    public GpkgWrapperImportReport getWrapperImportReport() {
        return wrapperImportReport;
    }

    public void setWrapperImportReport(GpkgWrapperImportReport wrapperImportReport) {
        this.wrapperImportReport = wrapperImportReport;
    }

    public GpkgImportDestinationProject getProject() {
        return project;
    }

    public void setProject(GpkgImportDestinationProject project) {
        this.project = project;
    }

    public List<GpkgTile> getTiles() {
        return tiles == null ? new ArrayList<>() : tiles;
    }

    public void setTiles(List<GpkgTile> tiles) {
        this.tiles = tiles == null ? new ArrayList<>() : tiles;
    }

    public List<GpkgTable> getTables() {
        return tables == null ? new ArrayList<>() : tables;
    }

    public void setTables(List<GpkgTable> tables) {
        this.tables = tables == null ? new ArrayList<>() : tables;
    }

    public List<GpkgLayer> getLayers() {
        return layers == null ? new ArrayList<>() : layers;
    }

    public void setLayers(List<GpkgLayer> layers) {
        this.layers = layers == null ? new ArrayList<>() : layers;
    }

    public List<GpkgStyle> getStyles() {
        return styles == null ? new ArrayList<>() : styles;
    }

    public void setStyles(List<GpkgStyle> styles) {
        this.styles = styles == null ? new ArrayList<>() : styles;
    }

    public List<GpkgFile> getFiles() {
        return files == null ? new ArrayList<>() : files;
    }

    public void setFiles(List<GpkgFile> files) {
        this.files = files == null ? new ArrayList<>() : files;
    }

    @Override
    public String toString() {
        return "{" +
                "\"gpkgContents\":" + (gpkgContents == null ? "null" : Arrays.toString(gpkgContents.toArray())) + ", " +
                "\"wrapperImportReport\":" + (wrapperImportReport == null ? "null" : wrapperImportReport) + ", " +
                "\"project\":" + (project == null ? "null" : project) + ", " +
                "\"tiles\":" + (tiles == null ? "null" : Arrays.toString(tiles.toArray())) + ", " +
                "\"tables\":" + (tables == null ? "null" : Arrays.toString(tables.toArray())) + ", " +
                "\"layers\":" + (layers == null ? "null" : Arrays.toString(layers.toArray())) + ", " +
                "\"styles\":" + (styles == null ? "null" : Arrays.toString(styles.toArray())) + ", " +
                "\"files\":" + (files == null ? "null" : Arrays.toString(files.toArray())) +
                "}";
    }
}
