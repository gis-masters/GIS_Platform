package ru.mycrg.auth_service.queue;

import ru.mycrg.auth_service_contract.IAuthServiceEvent;

public interface IResponseHandler {
    void handle(IAuthServiceEvent event);
}
