package ru.mycrg.data_service_contract.queue.request;

import ru.mycrg.data_service_contract.dto.gpkg.GpkgAppendingData;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.INTEGRATION_TO_DATA_QUEUE;

public class AppendGpkgInfoEvent extends DefaultMessageBusRequestEvent {

    private String dbName;
    private String businessKey;
    private String pathToGpkg;
    private GpkgAppendingData gpkgAppendingData;

    public AppendGpkgInfoEvent() {
        super();
    }

    public AppendGpkgInfoEvent(String dbName,
                               String businessKey,
                               String pathToGpkg,
                               GpkgAppendingData gpkgAppendingData) {
        super(UUID.randomUUID(), INTEGRATION_TO_DATA_QUEUE);

        this.dbName = dbName;
        this.businessKey = businessKey;
        this.pathToGpkg = pathToGpkg;
        this.gpkgAppendingData = gpkgAppendingData;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public String getBusinessKey() {
        return businessKey;
    }

    public void setBusinessKey(String businessKey) {
        this.businessKey = businessKey;
    }

    public String getPathToGpkg() {
        return pathToGpkg;
    }

    public void setPathToGpkg(String pathToGpkg) {
        this.pathToGpkg = pathToGpkg;
    }

    public GpkgAppendingData getGpkgAppendingData() {
        return gpkgAppendingData;
    }

    public void setGpkgAppendingData(GpkgAppendingData gpkgAppendingData) {
        this.gpkgAppendingData = gpkgAppendingData;
    }
}
