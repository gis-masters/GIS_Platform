package ru.mycrg.data_service_contract.queue.response;

import ru.mycrg.data_service_contract.queue.request.PlaceMidFileEvent;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusResponseEvent;

import static ru.mycrg.messagebus_contract.MessageBusProperties.INTEGRATION_TO_DATA_QUEUE;

public class MidPlacedFailedEvent extends DefaultMessageBusResponseEvent {

    private String reason;
    private PlaceMidFileEvent placeMidFileEvent;

    public MidPlacedFailedEvent() {
        super();
    }

    public MidPlacedFailedEvent(PlaceMidFileEvent placeMidFileEvent, String reason) {
        super(placeMidFileEvent, INTEGRATION_TO_DATA_QUEUE);

        this.reason = reason;
        this.placeMidFileEvent = placeMidFileEvent;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public PlaceMidFileEvent getPlaceMidFileEvent() {
        return placeMidFileEvent;
    }

    public void setPlaceMidFileEvent(PlaceMidFileEvent placeMidFileEvent) {
        this.placeMidFileEvent = placeMidFileEvent;
    }
}
