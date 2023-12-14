package ru.mycrg.data_service_contract.queue.response;

import ru.mycrg.data_service_contract.queue.request.PlaceTabFileEvent;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusResponseEvent;

import static ru.mycrg.messagebus_contract.MessageBusProperties.INTEGRATION_TO_DATA_QUEUE;

public class TabPlacedSucceededEvent extends DefaultMessageBusResponseEvent {

    private PlaceTabFileEvent placeTabFileEvent;

    public TabPlacedSucceededEvent() {
        super();
    }

    public TabPlacedSucceededEvent(PlaceTabFileEvent placeTabFileEvent) {
        super(placeTabFileEvent, INTEGRATION_TO_DATA_QUEUE);

        this.placeTabFileEvent = placeTabFileEvent;
    }

    public PlaceTabFileEvent getPlaceTabFileEvent() {
        return placeTabFileEvent;
    }

    public void setPlaceTabFileEvent(PlaceTabFileEvent placeTabFileEvent) {
        this.placeTabFileEvent = placeTabFileEvent;
    }
}
