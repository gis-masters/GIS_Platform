package ru.mycrg.common_contracts.generated.data_service.gpkg.import_;

import ru.mycrg.common_contracts.generated.gis_service.LayerType;

import java.io.Serializable;
import java.util.Arrays;

public class GpkgLayer extends GpkgReportBaseDto implements Serializable {

    private Long createdTableId;
    private String tableIdentifier;
    private String source;
    private String styleName;
    private LayerType type;

    public GpkgLayer() {
    }

    public GpkgLayer(GpkgProcessStatus status, String title,
                     String styleName, String tableIdentifier, String source) {

        super(title, status);

        this.styleName = styleName;
        this.tableIdentifier = tableIdentifier;
        this.source = source;
    }

    public GpkgLayer(GpkgProcessStatus status, String title,
                     String styleName, String tableIdentifier, String source, LayerType type) {

        super(title, status);

        this.styleName = styleName;
        this.tableIdentifier = tableIdentifier;
        this.source = source;
        this.type = type;
    }

    public Long getCreatedTableId() {
        return createdTableId;
    }

    public void setCreatedTableId(Long createdTableId) {
        this.createdTableId = createdTableId;
    }

    public String getTableIdentifier() {
        return tableIdentifier;
    }

    public void setTableIdentifier(String identifier) {
        this.tableIdentifier = identifier;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String dataset) {
        this.source = dataset;
    }

    public String getStyleName() {
        return styleName;
    }

    public void setStyleName(String styleName) {
        this.styleName = styleName;
    }

    public LayerType getType() {
        return type;
    }

    public void setType(LayerType type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "{" +
                "\"title\":" + (getTitle() == null ? "null" : "\"" + getTitle() + "\"") + ", " +
                "\"status\":" + (getStatus() == null ? "null" : getStatus()) + ", " +
                "\"messages\":" + (getMessages() == null ? "null" : Arrays.toString(getMessages().toArray())) + ", " +
                "\"createdTableId\":" + (createdTableId == null ? "null" : "\"" + createdTableId + "\"") + ", " +
                "\"tableIdentifier\":" + (tableIdentifier == null ? "null" : "\"" + tableIdentifier + "\"") + ", " +
                "\"source\":" + (source == null ? "null" : "\"" + source + "\"") + ", " +
                "\"styleName\":" + (styleName == null ? "null" : "\"" + styleName + "\"") + ", " +
                "\"type\":" + (type == null ? "null" : type) +
                "}";
    }
}
