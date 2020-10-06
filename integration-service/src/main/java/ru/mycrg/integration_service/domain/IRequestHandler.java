package ru.mycrg.integration_service.domain;

import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;

public interface IRequestHandler {
    void handle(BaseMqProcessRequest mqRequest);
}
