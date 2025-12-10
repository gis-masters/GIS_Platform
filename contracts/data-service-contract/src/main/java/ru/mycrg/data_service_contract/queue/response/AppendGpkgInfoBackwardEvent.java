package ru.mycrg.data_service_contract.queue.response;

import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.DATA_TO_INTEGRATION_QUEUE;

public class AppendGpkgInfoBackwardEvent extends DefaultMessageBusRequestEvent {

    private String businessKey;
    private ProcessStatus status;
    private String errorMsg;

    public AppendGpkgInfoBackwardEvent() {
        super();
    }

    public AppendGpkgInfoBackwardEvent(String businessKey, ProcessStatus status) {
        super(UUID.randomUUID(), DATA_TO_INTEGRATION_QUEUE);

        this.businessKey = businessKey;
        this.status = status;
    }

    public AppendGpkgInfoBackwardEvent(String businessKey,
                                       ProcessStatus status,
                                       String errorMsg) {
        super(UUID.randomUUID(), DATA_TO_INTEGRATION_QUEUE);

        this.businessKey = businessKey;
        this.status = status;
        this.errorMsg = errorMsg;
    }

    public String getBusinessKey() {
        return businessKey;
    }

    public void setBusinessKey(String businessKey) {
        this.businessKey = businessKey;
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }

    public String getErrorMsg() {
        return errorMsg;
    }

    public void setErrorMsg(String errorMsg) {
        this.errorMsg = errorMsg;
    }
}
