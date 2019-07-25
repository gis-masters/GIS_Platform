package ru.mycrg.wrapper.service.requests_handler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.wrapper.queue.MqListener;
import ru.mycrg.wrapper.queue.MqSender;

/**
 * Данный диспетчер находит нужный обработчик запроса, имплементирующий {@link IRequestHandler} <p>
 * Отправляет ответ об ошибке в случе если обработчик не найден.
 */
@Service
public class EventDispatcher {

    private static final Logger log = LoggerFactory.getLogger(MqListener.class);

    private final MqSender mqSender;
    private final RequestHandlerFactory requestHandlerFactory;

    public EventDispatcher(RequestHandlerFactory requestHandlerFactory, MqSender mqSender) {
        this.mqSender = mqSender;
        this.requestHandlerFactory = requestHandlerFactory;
    }

    public void handleEvent(BaseMqProcessRequest mqRequest) {
        log.info("handleEvent: {}", mqRequest.getId());

        try {
            requestHandlerFactory
                    .getHandler(mqRequest.getType())
                    .handle(mqRequest);
        } catch (Exception e) {
            mqSender.send(new BaseMqProcessResponse(mqRequest, ProcessStatus.ERROR, e.getMessage()));
        }
    }

}
