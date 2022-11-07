package ru.mycrg.data_service_contract.queue.response;

import ru.mycrg.data_service_contract.enums.ProcessStatus;
import ru.mycrg.data_service_contract.queue.request.ShapeLoadedEvent;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusResponseEvent;

import static ru.mycrg.messagebus_contract.MessageBusProperties.GEO_WRAPPER_TO_DATA_QUEUE;

public class ShapeImportedEvent extends DefaultMessageBusResponseEvent {

    private ShapeLoadedEvent importGeometryShapeEvent;

    public ShapeImportedEvent() {
        super();
    }

    public ShapeImportedEvent(ShapeLoadedEvent event,
                              ProcessStatus status,
                              String description,
                              int progress,
                              String payload) {
        super(event, GEO_WRAPPER_TO_DATA_QUEUE);

        this.importGeometryShapeEvent = event;
    }

    public ShapeImportedEvent(ShapeLoadedEvent event,
                              ProcessStatus status,
                              String description,
                              int progress,
                              String payload,
                              String error) {
        super(event, GEO_WRAPPER_TO_DATA_QUEUE);

        this.importGeometryShapeEvent = event;
    }

    public ShapeLoadedEvent getImportGeometryShapeEvent() {
        return importGeometryShapeEvent;
    }

    public void setImportGeometryShapeEvent(ShapeLoadedEvent importGeometryShapeEvent) {
        this.importGeometryShapeEvent = importGeometryShapeEvent;
    }
}
