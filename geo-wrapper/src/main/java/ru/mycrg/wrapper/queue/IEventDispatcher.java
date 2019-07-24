package ru.mycrg.wrapper.queue;

import ru.mycrg.common.BaseMqProcessRequest;

public interface IEventDispatcher {

    void handleEvent(BaseMqProcessRequest mqRequest);
}
