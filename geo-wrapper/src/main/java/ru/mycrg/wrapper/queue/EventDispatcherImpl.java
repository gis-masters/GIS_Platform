package ru.mycrg.wrapper.queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;

@Service
public class EventDispatcherImpl implements EventDispatcher {

    private static final Logger log = LoggerFactory.getLogger(MqListener.class);

    @Override
    public void handleEvent(BaseMqProcessRequest mqRequest) {

    }

}
