package ru.mycrg.data_service_contract.queue.request.gpkg;

import ru.mycrg.data_service_contract.dto.ErrorReport;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.io.Serializable;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.DATA_TO_INTEGRATION_QUEUE;

public class ImportGpkgCopyDataBackwardEvent extends DefaultMessageBusRequestEvent implements Serializable {

    private ProcessStatus status;
    private String businessKey;
    private ErrorReport errorReport = new ErrorReport();

    public ImportGpkgCopyDataBackwardEvent() {
        super(UUID.randomUUID(), DATA_TO_INTEGRATION_QUEUE);
    }

    public ImportGpkgCopyDataBackwardEvent(ProcessStatus status, String businessKey, ErrorReport errorReport) {
        super(UUID.randomUUID(), DATA_TO_INTEGRATION_QUEUE);

        this.status = status;
        this.businessKey = businessKey;
        this.errorReport = errorReport;
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

    public ErrorReport getErrorReport() {
        return errorReport != null ? errorReport : new ErrorReport();
    }

    public void setErrorReport(ErrorReport errorReport) {
        this.errorReport = errorReport != null ? errorReport : new ErrorReport();
    }
}
