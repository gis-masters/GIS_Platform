package ru.mycrg.common_contracts.generated.data_service.gpkg.import_;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class GpkgPayloadData implements Serializable {

    private List<GpkgTablesData> tablesInGpkg;

    private GpkgImportDestinationProject project;

    private GpkgWrapperImportReport wrapperImportReport;

    private List<GpkgTable> tables = new ArrayList<>();

    private List<GpkgFile> files = new ArrayList<>();

    private List<GpkgStyle> styles = new ArrayList<>();

    private List<GpkgLayer> layers = new ArrayList<>();

    public GpkgPayloadData() {
    }

    public List<GpkgTablesData> getTablesInGpkg() {
        return tablesInGpkg;
    }

    public void setTablesInGpkg(List<GpkgTablesData> tablesInGpkg) {
        this.tablesInGpkg = tablesInGpkg;
    }

    public GpkgImportDestinationProject getProject() {
        return project;
    }

    public void setProject(GpkgImportDestinationProject project) {
        this.project = project;
    }

    public GpkgWrapperImportReport getWrapperImportReport() {
        return wrapperImportReport;
    }

    public void setWrapperImportReport(GpkgWrapperImportReport wrapperImportReport) {
        this.wrapperImportReport = wrapperImportReport;
    }

    public List<GpkgTable> getTables() {
        if (tables == null) {
            tables = new ArrayList<>();
        }

        return tables;
    }

    public void setTables(List<GpkgTable> tables) {
        this.tables = tables != null ? tables : new ArrayList<>();
    }

    public List<GpkgStyle> getStyles() {
        if (styles == null) {
            styles = new ArrayList<>();
        }

        return styles;
    }

    public List<GpkgFile> getFiles() {
        if (files == null) {
            files = new ArrayList<>();
        }

        return files;
    }

    public void setFiles(List<GpkgFile> files) {
        this.files = files != null ? files : new ArrayList<>();
    }

    public void setStyles(List<GpkgStyle> styles) {
        this.styles = styles != null ? styles : new ArrayList<>();
    }

    public List<GpkgLayer> getLayers() {
        if (layers == null) {
            layers = new ArrayList<>();
        }

        return layers;
    }

    public void setLayers(List<GpkgLayer> layers) {
        this.layers = layers != null ? layers : new ArrayList<>();
    }

    @Override
    public String toString() {
        return "{" +
                "\"tablesInGpkg\":" + (tablesInGpkg == null ? "null" : tablesInGpkg) + ", " +
                "\"project\":" + (project == null ? "null" : project) + ", " +
                "\"wrapperImportReport\":" + (wrapperImportReport == null ? "null" : wrapperImportReport) + ", " +
                "\"tables\":" + (tables == null ? "null" : tables + ", ") +
                "\"files\":" + (files == null ? "null" : files + ", ") +
                "\"styles\":" + (styles == null ? "null" : styles + ", ") +
                "\"layers\":" + (layers == null ? "null" : layers) +
                "}";
    }
}
