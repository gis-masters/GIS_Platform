package ru.mycrg.data_service_contract.queue.response;

import ru.mycrg.data_service_contract.queue.request.PlaceMidFileEvent;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusResponseEvent;

import static ru.mycrg.messagebus_contract.MessageBusProperties.INTEGRATION_TO_DATA_QUEUE;

public class MidPlacedSucceededEvent extends DefaultMessageBusResponseEvent {

    private PlaceMidFileEvent placeMidFileEvent;

    public MidPlacedSucceededEvent() {
        super();
    }

    public MidPlacedSucceededEvent(PlaceMidFileEvent placeMidFileEvent) {
        super(placeMidFileEvent, INTEGRATION_TO_DATA_QUEUE);

        this.placeMidFileEvent = placeMidFileEvent;
    }

    public PlaceMidFileEvent getPlaceMidFileEvent() {
        return placeMidFileEvent;
    }

    public void setPlaceMidFileEvent(PlaceMidFileEvent placeMidFileEvent) {
        this.placeMidFileEvent = placeMidFileEvent;
    }
}
