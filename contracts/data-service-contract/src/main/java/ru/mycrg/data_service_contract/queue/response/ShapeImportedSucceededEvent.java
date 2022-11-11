package ru.mycrg.data_service_contract.queue.response;

import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.queue.request.ShapeLoadedEvent;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusResponseEvent;

import static ru.mycrg.messagebus_contract.MessageBusProperties.GEO_WRAPPER_TO_DATA_QUEUE;

public class ShapeImportedSucceededEvent extends DefaultMessageBusResponseEvent {

    private ShapeLoadedEvent importGeometryShapeEvent;
    private ProcessStatus status;
    private String description;
    private int progress;
    private String payload;

    public ShapeImportedSucceededEvent() {
        super();
    }

    public ShapeImportedSucceededEvent(ShapeLoadedEvent event,
                                       ProcessStatus status,
                                       String description,
                                       int progress,
                                       String payload) {
        super(event, GEO_WRAPPER_TO_DATA_QUEUE);

        this.status = status;
        this.description = description;
        this.payload = payload;
        this.progress = progress;
        this.importGeometryShapeEvent = event;
    }

    public ShapeLoadedEvent getImportGeometryShapeEvent() {
        return importGeometryShapeEvent;
    }

    public void setImportGeometryShapeEvent(ShapeLoadedEvent importGeometryShapeEvent) {
        this.importGeometryShapeEvent = importGeometryShapeEvent;
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
}
