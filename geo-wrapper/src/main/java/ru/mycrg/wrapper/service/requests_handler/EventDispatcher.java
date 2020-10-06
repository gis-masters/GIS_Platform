package ru.mycrg.wrapper.service.requests_handler;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.*;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;
import ru.mycrg.mq_queue_contract.enums.ProcessStatus;
import ru.mycrg.wrapper.queue.MqSender;

/**
 * Данный диспетчер находит нужный обработчик запроса, имплементирующий {@link IRequestHandler} <p>
 * Отправляет ответ об ошибке в случе если обработчик не найден.
 */
@Service
public class EventDispatcher {

    private static final Logger log = LoggerFactory.getLogger(EventDispatcher.class);

    private final MqSender mqSender;
    private final RequestHandlerFactory requestHandlerFactory;

    public EventDispatcher(RequestHandlerFactory requestHandlerFactory, MqSender mqSender) {
        this.mqSender = mqSender;
        this.requestHandlerFactory = requestHandlerFactory;
    }

    public void handleEvent(@NotNull BaseMqProcessRequest mqRequest) {
        log.debug("handleEvent: {}", mqRequest.getId());

        try {
            requestHandlerFactory
                    .getHandler(mqRequest.getType())
                    .handle(mqRequest);
        } catch (Exception e) {
            mqSender.send(new BaseMqProcessResponse(mqRequest, ProcessStatus.ERROR, e.getMessage()));
        }
    }

    public void handleUserEvent(@NotNull IUserEvent mqEvent) {
        log.debug("handle user event: {}", mqEvent.getLogin());

        try {
            requestHandlerFactory
                    .getUserHandler(mqEvent)
                    .handle(mqEvent);
        } catch (Exception e) {
            mqSender.sendUserEvent(new UserProvisioningFailedEvent(mqEvent));
        }
    }
}
