package ru.mycrg.wrapper.service.requests_handler;

import ru.mycrg.common.BaseMqProcessRequest;

public interface IRequestHandler {
    void handle(BaseMqProcessRequest mqRequest);
}
