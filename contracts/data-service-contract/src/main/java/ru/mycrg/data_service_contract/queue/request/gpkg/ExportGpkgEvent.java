package ru.mycrg.data_service_contract.queue.request.gpkg;

import ru.mycrg.common_contracts.generated.data_service.gpkg.export.ExportGpkgPayload;
import ru.mycrg.common_contracts.generated.data_service.gpkg.export.GpkgExportDetailsModel;
import ru.mycrg.data_service_contract.dto.gpkg.GpkgAppendingData;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.io.Serializable;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.DATA_TO_INTEGRATION_QUEUE;

public class ExportGpkgEvent extends DefaultMessageBusRequestEvent implements Serializable {

    private Long processId;
    private String dbName;
    private String token;
    private ExportGpkgPayload payload;
    private GpkgAppendingData gpkgAppendingData;
    private GpkgExportDetailsModel gpkgExportDetailsModel;

    public ExportGpkgEvent() {
        super();
    }

    public ExportGpkgEvent(Long processId, String dbName, String token, ExportGpkgPayload payload) {
        super(UUID.randomUUID(), DATA_TO_INTEGRATION_QUEUE);

        this.processId = processId;
        this.dbName = dbName;
        this.token = token;
        this.payload = payload;
    }

    public Long getProcessId() {
        return processId;
    }

    public void setProcessId(Long processId) {
        this.processId = processId;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public ExportGpkgPayload getPayload() {
        return payload;
    }

    public void setPayload(ExportGpkgPayload payload) {
        this.payload = payload;
    }

    public GpkgExportDetailsModel getGpkgExportDetailsModel() {
        return gpkgExportDetailsModel;
    }

    public void setGpkgExportDetailsModel(GpkgExportDetailsModel gpkgExportDetailsModel) {
        this.gpkgExportDetailsModel = gpkgExportDetailsModel;
    }

    public GpkgAppendingData getGpkgAppendingData() {
        return gpkgAppendingData;
    }

    public void setGpkgAppendingData(GpkgAppendingData gpkgAppendingData) {
        this.gpkgAppendingData = gpkgAppendingData;
    }
}
