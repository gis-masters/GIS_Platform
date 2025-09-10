package ru.mycrg.data_service_contract.queue.response;

import ru.mycrg.data_service_contract.dto.ErrorReport;
import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.queue.request.GpkgStartLoaderEvent;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusResponseEvent;

import static ru.mycrg.messagebus_contract.MessageBusProperties.GEO_WRAPPER_TO_DATA_QUEUE;


//этот ивент Враппер через кролика нам поставит в дата сервис.
//Я вообще не понимаю зачем тут ErrorReport но вот GpkgStartLoaderEvent нужен чтобы можно было
//потом вычитывать стартовую информацию на начале пути

public class GpkgImportedSucceededEvent extends DefaultMessageBusResponseEvent {

    private GpkgStartLoaderEvent importGpkgEvent;
    private ProcessStatus status;
    private String description;
    private int progress;
    private String payload;
    private ErrorReport errorReport;

    public GpkgImportedSucceededEvent() {
        super();
    }

    public GpkgImportedSucceededEvent(GpkgStartLoaderEvent event,
                                      ProcessStatus status,
                                      String description,
                                      int progress,
                                      String payload,
                                      ErrorReport errorReport) {
        super(event, GEO_WRAPPER_TO_DATA_QUEUE);

        this.status = status;
        this.description = description;
        this.payload = payload;
        this.progress = progress;
        this.importGpkgEvent = event;
        this.errorReport = errorReport;
    }

    public GpkgStartLoaderEvent getImportGpkgEvent() {
        return importGpkgEvent;
    }

    public void setImportGpkgEvent(GpkgStartLoaderEvent importGpkgEvent) {
        this.importGpkgEvent = importGpkgEvent;
    }

    public ProcessStatus getStatus() {
        return status;
    }

    public void setStatus(ProcessStatus status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }

    public ErrorReport getErrorReport() {
        return errorReport;
    }

    public void setErrorReport(ErrorReport errorReport) {
        this.errorReport = errorReport;
    }
}
