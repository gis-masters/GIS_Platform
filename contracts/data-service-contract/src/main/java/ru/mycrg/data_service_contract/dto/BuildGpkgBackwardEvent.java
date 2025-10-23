package ru.mycrg.data_service_contract.dto;

import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.queue.request.BuildGpkgEvent;
import ru.mycrg.data_service_contract.queue.response.BaseResponseEvent;

import static ru.mycrg.messagebus_contract.MessageBusProperties.GEO_WRAPPER_TO_INTEGRATION_QUEUE;

public class BuildGpkgBackwardEvent extends BaseResponseEvent {

    private String businessKey;

    public BuildGpkgBackwardEvent() {
        super();
    }

    public BuildGpkgBackwardEvent(BuildGpkgEvent event,
                                  ProcessStatus status,
                                  String description,
                                  int progress,
                                  String payload) {
        super(event, GEO_WRAPPER_TO_INTEGRATION_QUEUE);

        setProcessId(event.getProcessId());
        this.businessKey = event.getBusinessKey();
        setDbName(event.getDbName());

        setStatus(status);
        setDescription(description);
        setProgress(progress);
        setPayload(payload);
    }

    public BuildGpkgBackwardEvent(BuildGpkgEvent event,
                                  ProcessStatus status,
                                  String error) {
        super(event, GEO_WRAPPER_TO_INTEGRATION_QUEUE);

        setProcessId(event.getProcessId());
        this.businessKey = event.getBusinessKey();
        setDbName(event.getDbName());

        setStatus(status);
        setError(error);
    }

    public String getBusinessKey() {
        return businessKey;
    }

    public void setBusinessKey(String businessKey) {
        this.businessKey = businessKey;
    }
}
