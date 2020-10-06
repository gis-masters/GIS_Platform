package ru.mycrg.integration_service.domain;

import ru.mycrg.auth_service_contract.IOrganizationEvent;

public interface IOrganizationRequestHandler {
    void handle(IOrganizationEvent mqRequest);
}
