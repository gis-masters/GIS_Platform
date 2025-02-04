package ru.mycrg.integration_service.queue.handlers;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.Variables;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.events.request.UserDeletedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.enums.BpmnProcessKey.USER_DELETE_PROCESS;

@Service
public class UserDeletedEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(UserDeletedEventHandler.class);

    private final RuntimeService bpmnRuntimeService;

    public UserDeletedEventHandler(RuntimeService bpmnRuntimeService) {
        this.bpmnRuntimeService = bpmnRuntimeService;
    }

    @Override
    public String getEventType() {
        return UserDeletedEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent event) {
        try {
            UserDeletedEvent mqEvent = (UserDeletedEvent) event;
            VariableMap variables = Variables
                    .createVariables()
                    .putValue(USERS_VAR_NAME, mqEvent.getLogin())
                    .putValue(ENTITY_ID_VAR_NAME, mqEvent.getUserId())
                    .putValue(TOKEN_VAR_NAME, mqEvent.getToken());

            bpmnRuntimeService.startProcessInstanceByKey(
                    USER_DELETE_PROCESS.getValue(),
                    mqEvent.getUserId().toString(),
                    variables);
        } catch (Exception e) {
            log.error("Не удалось стартовать процесс удаления разрешений пользователя: ", e);
        }
    }
}
