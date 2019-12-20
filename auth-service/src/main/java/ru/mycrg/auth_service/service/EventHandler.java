package ru.mycrg.auth_service.service;

import ru.mycrg.auth_service_contract.IOrganizationEvent;

public interface EventHandler {

    void handle(IOrganizationEvent mqEvent);
}
