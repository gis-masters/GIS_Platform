package ru.mycrg.data_service_contract.queue.response;

import ru.mycrg.data_service_contract.queue.request.PlaceShapeFileEvent;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusResponseEvent;

import static ru.mycrg.messagebus_contract.MessageBusProperties.INTEGRATION_TO_DATA_QUEUE;

public class ShpPlacedSucceededEvent extends DefaultMessageBusResponseEvent {

    private PlaceShapeFileEvent placeShapeFileEvent;

    public ShpPlacedSucceededEvent() {
        super();
    }

    public ShpPlacedSucceededEvent(PlaceShapeFileEvent placeShapeFileEvent) {
        super(placeShapeFileEvent, INTEGRATION_TO_DATA_QUEUE);

        this.placeShapeFileEvent = placeShapeFileEvent;
    }

    public PlaceShapeFileEvent getPlaceShapeFileEvent() {
        return placeShapeFileEvent;
    }

    public void setPlaceShapeFileEvent(PlaceShapeFileEvent placeShapeFileEvent) {
        this.placeShapeFileEvent = placeShapeFileEvent;
    }
}
