package ru.mycrg.wrapper.service.requests_handler;

import ru.mycrg.auth_service_contract.IOrganizationEvent;

public interface IOrganizationRequestHandler {
    void handle(IOrganizationEvent mqRequest);
}
