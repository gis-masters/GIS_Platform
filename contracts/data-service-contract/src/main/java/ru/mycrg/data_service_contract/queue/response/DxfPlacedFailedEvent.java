package ru.mycrg.data_service_contract.queue.response;

import ru.mycrg.data_service_contract.queue.request.PlaceDxfFileEvent;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusResponseEvent;

import static ru.mycrg.messagebus_contract.MessageBusProperties.INTEGRATION_TO_DATA_QUEUE;

public class DxfPlacedFailedEvent extends DefaultMessageBusResponseEvent {

    private String reason;
    private PlaceDxfFileEvent placeDxfFileEvent;

    public DxfPlacedFailedEvent() {
        super();
    }

    public DxfPlacedFailedEvent(PlaceDxfFileEvent placeDxfFileEvent, String reason) {
        super(placeDxfFileEvent, INTEGRATION_TO_DATA_QUEUE);

        this.reason = reason;
        this.placeDxfFileEvent = placeDxfFileEvent;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public PlaceDxfFileEvent getPlaceDxfFileEvent() {
        return placeDxfFileEvent;
    }

    public void setPlaceDxfFileEvent(PlaceDxfFileEvent placeDxfFileEvent) {
        this.placeDxfFileEvent = placeDxfFileEvent;
    }
}
