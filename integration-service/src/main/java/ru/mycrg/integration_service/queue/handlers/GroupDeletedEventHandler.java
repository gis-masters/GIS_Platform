package ru.mycrg.integration_service.queue.handlers;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.Variables;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.events.request.UserGroupDeletedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.enums.BpmnProcessKey.CLEAR_GROUP_PERMISSIONS;

@Service
public class GroupDeletedEventHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(GroupDeletedEventHandler.class);

    private final RuntimeService bpmnRuntimeService;

    public GroupDeletedEventHandler(RuntimeService bpmnRuntimeService) {
        this.bpmnRuntimeService = bpmnRuntimeService;
    }

    @Override
    public String getEventType() {
        return UserGroupDeletedEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent event) {
        try {
            UserGroupDeletedEvent mqEvent = (UserGroupDeletedEvent) event;
            VariableMap variables = Variables
                    .createVariables()
                    .putValue(EVENT_VAR_NAME, objectMapper.writeValueAsString(mqEvent))
                    .putValue(ENTITY_ID_VAR_NAME, mqEvent.getGroupId())
                    .putValue(TOKEN_VAR_NAME, mqEvent.getToken());

            bpmnRuntimeService.startProcessInstanceByKey(
                    CLEAR_GROUP_PERMISSIONS.getValue(),
                    mqEvent.getGroupId().toString(),
                    variables);
        } catch (Exception e) {
            log.error("Не удалось стартовать процесс удаления разрешений группы пользователей: ", e);
        }
    }
}
