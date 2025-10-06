package ru.mycrg.data_service_contract.dto;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.Pattern;
import java.util.LinkedList;
import java.util.List;

// TODO: в будущем вернуться к врапперу. пока как есть
public class ExportRequestModel {

    private String wsUiId;

    private String docSchema;

    @NotBlank
    @Pattern(regexp = "^(GML|GPKG|ESRI Shapefile)$", message = "Допустимые форматы: 'ESRI Shapefile', 'GML', 'GPKG'")
    private String format;

    @Valid
    @NotEmpty
    private List<ExportResourceModel> resources = new LinkedList<>();

    private List<ExportDetails> exportDetails = new LinkedList<>();

    private String epsg;

    private boolean invertedCoordinates;

    public String getWsUiId() {
        return wsUiId;
    }

    public void setWsUiId(String wsUiId) {
        this.wsUiId = wsUiId;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public List<ExportResourceModel> getResources() {
        return resources;
    }

    public void setResources(List<ExportResourceModel> resources) {
        this.resources = resources;
    }

    public String getDocSchema() {
        return docSchema;
    }

    public void setDocSchema(String docSchema) {
        this.docSchema = docSchema;
    }

    public String getEpsg() {
        return epsg;
    }

    public void setEpsg(String epsg) {
        this.epsg = epsg;
    }

    public boolean isInvertedCoordinates() {
        return invertedCoordinates;
    }

    public void setInvertedCoordinates(boolean invertedCoordinates) {
        this.invertedCoordinates = invertedCoordinates;
    }

    public List<ExportDetails> getExportDetails() {
        return exportDetails;
    }

    public void setExportDetails(List<ExportDetails> exportDetails) {
        this.exportDetails = exportDetails;
    }
}
