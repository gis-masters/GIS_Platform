package ru.mycrg.data_service_contract.queue.request.gpkg;

import ru.mycrg.data_service_contract.dto.ExportResourceModel;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.INTEGRATION_TO_DATA_QUEUE;

public class AppendGpkgFilesEvent extends DefaultMessageBusRequestEvent {

    private String dbName;
    private String businessKey;
    private String pathToGpkg;
    private List<ExportResourceModel> resourceProjections = new ArrayList<>();

    public AppendGpkgFilesEvent() {
        super();
    }

    public AppendGpkgFilesEvent(String dbName,
                                String businessKey,
                                String pathToGpkg,
                                List<ExportResourceModel> resourceProjections) {
        super(UUID.randomUUID(), INTEGRATION_TO_DATA_QUEUE);

        this.dbName = dbName;
        this.businessKey = businessKey;
        this.pathToGpkg = pathToGpkg;
        this.resourceProjections = resourceProjections;
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

    public List<ExportResourceModel> getResourceProjections() {
        return resourceProjections;
    }

    public void setResourceProjections(
            List<ExportResourceModel> resourceProjections) {
        this.resourceProjections = resourceProjections;
    }
}