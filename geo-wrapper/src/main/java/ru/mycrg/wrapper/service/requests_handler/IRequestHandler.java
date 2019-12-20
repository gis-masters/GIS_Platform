package ru.mycrg.wrapper.service.requests_handler;

import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;

public interface IRequestHandler {
    void handle(BaseMqProcessRequest mqRequest);
}
