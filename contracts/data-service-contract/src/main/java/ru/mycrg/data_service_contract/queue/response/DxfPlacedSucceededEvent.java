package ru.mycrg.data_service_contract.queue.response;

import ru.mycrg.data_service_contract.queue.request.PlaceDxfFileEvent;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusResponseEvent;

import static ru.mycrg.messagebus_contract.MessageBusProperties.INTEGRATION_TO_DATA_QUEUE;

public class DxfPlacedSucceededEvent extends DefaultMessageBusResponseEvent {

    private PlaceDxfFileEvent placeDxfFileEvent;

    public DxfPlacedSucceededEvent() {
        super();
    }

    public DxfPlacedSucceededEvent(PlaceDxfFileEvent placeDxfFileEvent) {
        super(placeDxfFileEvent, INTEGRATION_TO_DATA_QUEUE);

        this.placeDxfFileEvent = placeDxfFileEvent;
    }

    public PlaceDxfFileEvent getPlaceDxfFileEvent() {
        return placeDxfFileEvent;
    }

    public void setPlaceDxfFileEvent(PlaceDxfFileEvent placeDxfFileEvent) {
        this.placeDxfFileEvent = placeDxfFileEvent;
    }
}
