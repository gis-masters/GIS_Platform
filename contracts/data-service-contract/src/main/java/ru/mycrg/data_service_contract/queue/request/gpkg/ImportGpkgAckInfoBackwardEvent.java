package ru.mycrg.data_service_contract.queue.request.gpkg;

import ru.mycrg.common_contracts.generated.data_service.gpkg.GpkgImportedStyles;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.gis_service_contract.dto.LayerProjection;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.DATA_TO_INTEGRATION_QUEUE;

public class ImportGpkgAckInfoBackwardEvent extends DefaultMessageBusRequestEvent implements Serializable {

    private ProcessStatus status;
    private String businessKey;
    private String errorMessage;
    private ResourceProjection table;
    private List<LayerProjection> layerProjections = new ArrayList<>();
    private List<GpkgImportedStyles> styles = new ArrayList<>();

    public ImportGpkgAckInfoBackwardEvent() {
        super(UUID.randomUUID(), DATA_TO_INTEGRATION_QUEUE);
    }

    public ImportGpkgAckInfoBackwardEvent(ProcessStatus status, String businessKey, String errorMessage) {
        super(UUID.randomUUID(), DATA_TO_INTEGRATION_QUEUE);

        this.status = status;
        this.businessKey = businessKey;
        this.errorMessage = errorMessage;
    }

    public ImportGpkgAckInfoBackwardEvent(ProcessStatus status,
                                          String businessKey,
                                          ResourceProjection table,
                                          List<LayerProjection> layerProjections,
                                          List<GpkgImportedStyles> styles) {
        super(UUID.randomUUID(), DATA_TO_INTEGRATION_QUEUE);

        this.status = status;
        this.businessKey = businessKey;
        this.table = table;
        this.layerProjections = layerProjections != null ? layerProjections : new ArrayList<>();
        this.styles = styles != null ? styles : new ArrayList<>();
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }

    public String getBusinessKey() {
        return businessKey;
    }

    public void setBusinessKey(String businessKey) {
        this.businessKey = businessKey;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public ResourceProjection getTable() {
        return table;
    }

    public void setTable(ResourceProjection table) {
        this.table = table;
    }

    public List<LayerProjection> getLayerProjections() {
        if (layerProjections == null) {
            layerProjections = new ArrayList<>();
        }

        return layerProjections;
    }

    public void setLayerProjections(List<LayerProjection> layerProjections) {
        this.layerProjections = layerProjections != null ? layerProjections : new ArrayList<>();
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

    @Override
    public String toString() {
        return "{" +
                "\"status\":" + (status == null ? "null" : status) + ", " +
                "\"businessKey\":" + (businessKey == null ? "null" : "\"" + businessKey + "\"") + ", " +
                "\"errorMessage\":" + (errorMessage == null ? "null" : "\"" + errorMessage + "\"") + ", " +
                "\"table\":" + (table == null ? "null" : table) + ", " +
                "\"layerProjections\":" + (layerProjections == null ? "null" : "\"" + layerProjections + "\"") + ", " +
                "\"styles\":" + (styles == null ? "null" : "\"" + styles + "\"") + ", " +
                "}";
    }
}
