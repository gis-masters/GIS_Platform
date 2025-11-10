package ru.mycrg.data_service_contract.queue.request.gpkg;

import ru.mycrg.data_service_contract.dto.ResourceQualifierDto;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.io.Serializable;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.INTEGRATION_TO_DATA_QUEUE;

public class ImportGpkgCopyDataEvent extends DefaultMessageBusRequestEvent implements Serializable {

    private String businessKey;
    private String dbName;
    private String creator;
    private ResourceQualifierDto source;
    private ResourceQualifierDto target;

    public ImportGpkgCopyDataEvent() {
        super(UUID.randomUUID(), INTEGRATION_TO_DATA_QUEUE);
    }

    public ImportGpkgCopyDataEvent(String businessKey,
                                   String dbName,
                                   String creator,
                                   ResourceQualifierDto source,
                                   ResourceQualifierDto target) {
        super(UUID.randomUUID(), INTEGRATION_TO_DATA_QUEUE);

        this.businessKey = businessKey;
        this.dbName = dbName;
        this.creator = creator;
        this.source = source;
        this.target = target;
    }

    public String getBusinessKey() {
        return businessKey;
    }

    public void setBusinessKey(String businessKey) {
        this.businessKey = businessKey;
    }

    public String getDbName() {
        return dbName;
    }

    public void setDbName(String dbName) {
        this.dbName = dbName;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public ResourceQualifierDto getSource() {
        return source;
    }

    public void setSource(ResourceQualifierDto source) {
        this.source = source;
    }

    public ResourceQualifierDto getTarget() {
        return target;
    }

    public void setTarget(ResourceQualifierDto target) {
        this.target = target;
    }
}
