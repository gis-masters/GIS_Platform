package ru.mycrg.data_service_contract.queue.request;

import ru.mycrg.common_contracts.generated.gpkg.GkpgExportDetailsModel;
import ru.mycrg.data_service_contract.dto.gpkg.GpkgAppendingData;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.DATA_TO_INTEGRATION_QUEUE;

public class ExportGpkgEvent extends DefaultMessageBusRequestEvent implements Serializable {

    @NotNull
    private Long processId;
    private String dbName;
    @NotNull
    private String token;
    private Object payload;
    private GpkgAppendingData gpkgAppendingData;
    private GkpgExportDetailsModel gkpgExportDetailsModel;

    public ExportGpkgEvent() {
        super();
    }

    public ExportGpkgEvent(Long processId, String dbName, String token, Object payload) {
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

    public Object getPayload() {
        return payload;
    }

    public void setPayload(Object payload) {
        this.payload = payload;
    }

    public GkpgExportDetailsModel getGkpgExportDetailsModel() {
        return gkpgExportDetailsModel;
    }

    public void setGkpgExportDetailsModel(GkpgExportDetailsModel gkpgExportDetailsModel) {
        this.gkpgExportDetailsModel = gkpgExportDetailsModel;
    }

    public GpkgAppendingData getGpkgAppendingData() {
        return gpkgAppendingData;
    }

    public void setGpkgAppendingData(GpkgAppendingData gpkgAppendingData) {
        this.gpkgAppendingData = gpkgAppendingData;
    }
}
