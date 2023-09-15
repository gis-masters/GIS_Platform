package ru.mycrg.data_service_contract.queue.response;

import ru.mycrg.data_service_contract.queue.request.PlaceShapeFileEvent;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusResponseEvent;

import static ru.mycrg.messagebus_contract.MessageBusProperties.INTEGRATION_TO_DATA_QUEUE;

public class ShpPlacedFailedEvent extends DefaultMessageBusResponseEvent {

    private String reason;
    private PlaceShapeFileEvent placeShapeFileEvent;

    public ShpPlacedFailedEvent() {
        super();
    }

    public ShpPlacedFailedEvent(PlaceShapeFileEvent placeShapeFileEvent, String reason) {
        super(placeShapeFileEvent, INTEGRATION_TO_DATA_QUEUE);

        this.reason = reason;
        this.placeShapeFileEvent = placeShapeFileEvent;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public PlaceShapeFileEvent getPlaceShapeFileEvent() {
        return placeShapeFileEvent;
    }

    public void setPlaceShapeFileEvent(PlaceShapeFileEvent placeShapeFileEvent) {
        this.placeShapeFileEvent = placeShapeFileEvent;
    }
}
