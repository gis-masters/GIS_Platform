package ru.mycrg.wrapper.service.requests_handler;

import ru.mycrg.auth_service_contract.IUserEvent;

public interface IUserRequestHandler {
    void handle(IUserEvent mqRequest);
}
