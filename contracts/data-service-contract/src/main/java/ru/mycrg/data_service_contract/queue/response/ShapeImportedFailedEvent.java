package ru.mycrg.data_service_contract.queue.response;

import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.queue.request.ShapeLoadedEvent;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusResponseEvent;

import static ru.mycrg.messagebus_contract.MessageBusProperties.GEO_WRAPPER_TO_DATA_QUEUE;

public class ShapeImportedFailedEvent extends DefaultMessageBusResponseEvent {

    private ShapeLoadedEvent importShapeEvent;
    private ProcessStatus status;
    private String description;
    private int progress;
    private String payload;
    private String warningMessage;
    private String errorMessage;

    public ShapeImportedFailedEvent() {
        super();
    }

    public ShapeImportedFailedEvent(ShapeLoadedEvent event,
                                    ProcessStatus status,
                                    String description,
                                    int progress,
                                    String payload,
                                    String warningMessage,
                                    String errorMessage) {
        super(event, GEO_WRAPPER_TO_DATA_QUEUE);
        this.status = status;
        this.description = description;
        this.payload = payload;
        this.progress = progress;
        this.importShapeEvent = event;
        this.warningMessage = warningMessage;
        this.errorMessage = errorMessage;
    }

    public ShapeLoadedEvent getImportShapeEvent() {
        return importShapeEvent;
    }

    public void setImportShapeEvent(ShapeLoadedEvent importShapeEvent) {
        this.importShapeEvent = importShapeEvent;
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

    public String getWarningMessage() {
        return warningMessage;
    }

    public void setWarningMessage(String warningMessage) {
        this.warningMessage = warningMessage;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
