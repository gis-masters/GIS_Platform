package ru.mycrg.acceptance.data_service.processes;

import ru.mycrg.acceptance.data_service.dto.ExportResourceModel;

public class GpkgPlacementModel {

    private String wsUiId;
    private ExportResourceModel resourses;
    private String epsg;
    private String format;

    public GpkgPlacementModel() {
        // Required
    }

    public String getWsUiId() {
        return wsUiId;
    }

    public void setWsUiId(String wsUiId) {
        this.wsUiId = wsUiId;
    }

    public ExportResourceModel getResourses() {
        return resourses;
    }

    public void setResourses(ExportResourceModel resourses) {
        this.resourses = resourses;
    }

    public String getEpsg() {
        return epsg;
    }

    public void setEpsg(String epsg) {
        this.epsg = epsg;
    }

    public String isFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }
}
