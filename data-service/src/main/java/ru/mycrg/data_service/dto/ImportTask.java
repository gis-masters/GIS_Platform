package ru.mycrg.data_service.dto;

import ru.mycrg.data_service_contract.dto.import_.MatchingPair;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import java.util.List;

/**
 * Соответствующая модель на ui -> portal-ui/src/app/services/geoserver/import/taskImport.ts
 */
public class ImportTask {

    @NotBlank(message = "Please provide layerName")
    private String layerName;

    @NotBlank(message = "Please provide workTableName")
    private String workTableName;

    @NotEmpty
    private List<MatchingPair> pairs;

    @NotBlank(message = "Please provide srs")
    private Integer srs;

    @NotBlank(message = "Please provide schemaName")
    private String schemaName;

    public ImportTask() {}

    public ImportTask(String layerName, String workTableName, List<MatchingPair> pairs) {
        this.layerName = layerName;
        this.workTableName = workTableName;
        this.pairs = pairs;
    }

    public String getLayerName() {
        return layerName;
    }

    public void setLayerName(String layerName) {
        this.layerName = layerName;
    }

    public String getWorkTableName() {
        return workTableName;
    }

    public void setWorkTableName(String workTableName) {
        this.workTableName = workTableName;
    }

    public List<MatchingPair> getPairs() {
        return pairs;
    }

    public void setPairs(List<MatchingPair> pairs) {
        this.pairs = pairs;
    }

    public Integer getSrs() {
        return srs;
    }

    public void setSrs(Integer srs) {
        this.srs = srs;
    }

    public String getSchemaName() {
        return schemaName;
    }

    public void setSchemaName(String schemaName) {
        this.schemaName = schemaName;
    }
}
