package ru.mycrg.wrapper.queue;

import ru.mycrg.common.BaseMqProcessRequest;

public interface EventDispatcher {

    void handleEvent(BaseMqProcessRequest mqRequest);
}
