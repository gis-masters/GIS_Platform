package ru.mycrg.common_contracts.generated.data_service.gpkg;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

public class GpkgPayloadData implements Serializable {

    private List<GpkgTablesData> tablesInGpkg;

    private GpkgImportDestinationProject project;

    private GpkgWrapperImportReport wrapperImportReport;

    private List<GpkgImportedTable> tables = new ArrayList<>();

    private List<GpkgImportedStyles> styles = new ArrayList<>();

    private List<GpkgImportedLayer> layers = new ArrayList<>();

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

    public List<GpkgImportedTable> getTables() {
        if (tables == null) {
            tables = new ArrayList<>();
        }

        return tables;
    }

    public void setTables(List<GpkgImportedTable> tables) {
        this.tables = tables != null ? tables : new ArrayList<>();
    }

    public List<GpkgImportedStyles> getStyles() {
        if (styles == null) {
            styles = new ArrayList<>();
        }

        return styles;
    }

    public void setStyles(List<GpkgImportedStyles> styles) {
        this.styles = styles != null ? styles : new ArrayList<>();
    }

    public List<GpkgImportedLayer> getLayers() {
        if (layers == null) {
            layers = new ArrayList<>();
        }

        return layers;
    }

    public void setLayers(List<GpkgImportedLayer> layers) {
        this.layers = layers != null ? layers : new ArrayList<>();
    }

    @Override
    public String toString() {
        return "{" +
                "\"tablesInGpkg\":" + (tablesInGpkg == null ? "null" : tablesInGpkg) + ", " +
                "\"project\":" + (project == null ? "null" : project) + ", " +
                "\"wrapperImportReport\":" + (wrapperImportReport == null ? "null" : wrapperImportReport) + ", " +
                "\"tables\":" + (tables == null ? "null" : tables + ", ") +
                "\"styles\":" + (styles == null ? "null" : styles + ", ") +
                "\"layers\":" + (layers == null ? "null" : layers) +
                "}";
    }
}
