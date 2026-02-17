package ru.mycrg.data_service_contract.queue.response;

import ru.mycrg.data_service_contract.dto.ErrorReport;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusResponseEvent;

import static ru.mycrg.messagebus_contract.MessageBusProperties.GEO_WRAPPER_TO_INTEGRATION_QUEUE;

//TODO: сдвинуть в пакет package ru.mycrg.messagebus_contract.events.integration_wrapper;
public class ExtractGpkgBackwardEvent extends DefaultMessageBusResponseEvent {

    private ProcessStatus status;
    private String businessKey;
    private String createdSchemaName;
    private ErrorReport errorReport;
    private String errorDescription;

    public ExtractGpkgBackwardEvent() {
        super();
    }

    public ExtractGpkgBackwardEvent(ProcessStatus status,
                                    String businessKey,
                                    String createdSchemaName,
                                    ErrorReport errorReport) {
        super(GEO_WRAPPER_TO_INTEGRATION_QUEUE);

        this.status = status;
        this.businessKey = businessKey;
        this.createdSchemaName = createdSchemaName;
        this.errorReport = errorReport;
    }

    public ExtractGpkgBackwardEvent(ProcessStatus status,
                                    String businessKey,
                                    String createdSchemaName,
                                    String errorDescription) {
        super(GEO_WRAPPER_TO_INTEGRATION_QUEUE);

        this.status = status;
        this.businessKey = businessKey;
        this.createdSchemaName = createdSchemaName;
        this.errorDescription = errorDescription;
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }

    public String getCreatedSchemaName() {
        return createdSchemaName;
    }

    public void setCreatedSchemaName(String createdSchemaName) {
        this.createdSchemaName = createdSchemaName;
    }

    public ErrorReport getErrorReport() {
        return errorReport;
    }

    public void setErrorReport(ErrorReport errorReport) {
        this.errorReport = errorReport;
    }

    public String getErrorDescription() {
        return errorDescription;
    }

    public void setErrorDescription(String errorDescription) {
        this.errorDescription = errorDescription;
    }

    public String getBusinessKey() {
        return businessKey;
    }

    public void setBusinessKey(String businessKey) {
        this.businessKey = businessKey;
    }
}
