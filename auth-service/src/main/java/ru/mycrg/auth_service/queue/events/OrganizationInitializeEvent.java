package ru.mycrg.auth_service.queue.events;

import ru.mycrg.auth_service_contract.dto.OrganizationCreateDto;
import ru.mycrg.messagebus_contract.events.DefaultMessageBusRequestEvent;

public class OrganizationInitializeEvent extends DefaultMessageBusRequestEvent {

    private final OrganizationCreateDto createDto;

    public OrganizationInitializeEvent(OrganizationCreateDto createDto) {
        this.createDto = createDto;
    }

    public OrganizationCreateDto getCreateDto() {
        return createDto;
    }
}
