package ru.mycrg.data_service_contract.queue.response;

import ru.mycrg.data_service_contract.queue.request.PlaceTabFileEvent;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusResponseEvent;

import static ru.mycrg.messagebus_contract.MessageBusProperties.INTEGRATION_TO_DATA_QUEUE;

public class TabPlacedFailedEvent extends DefaultMessageBusResponseEvent {

    private String reason;
    private PlaceTabFileEvent placeTabFileEvent;

    public TabPlacedFailedEvent() {
        super();
    }

    public TabPlacedFailedEvent(PlaceTabFileEvent placeTabFileEvent, String reason) {
        super(placeTabFileEvent, INTEGRATION_TO_DATA_QUEUE);

        this.reason = reason;
        this.placeTabFileEvent = placeTabFileEvent;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public PlaceTabFileEvent getPlaceTabFileEvent() {
        return placeTabFileEvent;
    }

    public void setPlaceTabFileEvent(PlaceTabFileEvent placeTabFileEvent) {
        this.placeTabFileEvent = placeTabFileEvent;
    }
}
