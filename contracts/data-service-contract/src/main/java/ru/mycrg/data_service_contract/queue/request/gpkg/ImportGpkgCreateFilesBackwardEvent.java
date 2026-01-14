package ru.mycrg.data_service_contract.queue.request.gpkg;

import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.DATA_TO_INTEGRATION_QUEUE;

public class ImportGpkgCreateFilesBackwardEvent extends DefaultMessageBusRequestEvent implements Serializable {

    private ProcessStatus status;
    private String businessKey;
    private Map<UUID, UUID> oldNewIds = new HashMap<>();

    public ImportGpkgCreateFilesBackwardEvent() {
        super(UUID.randomUUID(), DATA_TO_INTEGRATION_QUEUE);
    }

    public ImportGpkgCreateFilesBackwardEvent(ProcessStatus status, String businessKey, Map<UUID, UUID> oldNewIds) {

        super(UUID.randomUUID(), DATA_TO_INTEGRATION_QUEUE);

        this.status = status;
        this.businessKey = businessKey;
        this.oldNewIds = oldNewIds;
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

    public Map<UUID, UUID> getOldNewIds() {
        return oldNewIds;
    }

    public void setOldNewIds(Map<UUID, UUID> oldNewIds) {
        this.oldNewIds = oldNewIds != null ? oldNewIds : new HashMap<>();
    }
}
