package ru.mycrg.data_service_contract.queue.response;

import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgFile;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static ru.mycrg.messagebus_contract.MessageBusProperties.DATA_TO_INTEGRATION_QUEUE;

public class AppendGpkgFileBackwardEvent extends DefaultMessageBusRequestEvent {

    private String businessKey;
    private ProcessStatus status;
    private String errorMsg;
    private List<GpkgFile> files = new ArrayList<>();

    public AppendGpkgFileBackwardEvent() {
        super();
    }

    public AppendGpkgFileBackwardEvent(String businessKey, ProcessStatus status, List<GpkgFile> files) {
        super(UUID.randomUUID(), DATA_TO_INTEGRATION_QUEUE);

        this.businessKey = businessKey;
        this.status = status;
        this.files = files;
    }

    public AppendGpkgFileBackwardEvent(String businessKey,
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

    public List<GpkgFile> getFiles() {
        return files;
    }

    public void setFiles(List<GpkgFile> files) {
        this.files = files == null ? new ArrayList<>() : files;
    }
}
