package ru.mycrg.integration_service.domain;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.Variables;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.IOrganizationEvent;
import ru.mycrg.auth_service_contract.OrganizationDependencyRemovingFailedEvent;
import ru.mycrg.auth_service_contract.OrganizationRemovedEvent;
import ru.mycrg.integration_service.queue.MessageBusSender;

import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

/**
 * Сервис обрабатывающий событие создания организации.
 */
@Service
public class RemoveOrganizationHandler implements IOrganizationRequestHandler {

    private final Logger log = LoggerFactory.getLogger(RemoveOrganizationHandler.class);

    private final MessageBusSender messageBus;
    private final RuntimeService bpmnRuntimeService;

    public RemoveOrganizationHandler(MessageBusSender messageBus,
                                     RuntimeService bpmnRuntimeService) {
        this.messageBus = messageBus;
        this.bpmnRuntimeService = bpmnRuntimeService;
    }

    @Override
    public void handle(IOrganizationEvent event) {
        try {
            OrganizationRemovedEvent mqEvent = (OrganizationRemovedEvent) event;

            VariableMap variables = Variables
                    .createVariables()
                    .putValue(EVENT_VAR_NAME, objectMapper.writeValueAsString(mqEvent))
                    .putValue(ORG_ID_VAR_NAME, mqEvent.getOrgId())
                    .putValue(USERS_VAR_NAME, mqEvent.getUsers())
                    .putValue(TOKEN_VAR_NAME, mqEvent.getToken());

            bpmnRuntimeService.startProcessInstanceByKey(
                    REMOVE_ORGANIZATION_PROCESS_ID,
                    mqEvent.getOrgId().toString(),
                    variables);
        } catch (Exception e) {
            log.error("Не удалось стартовать процесс удаления организации: ", e);

            messageBus.sendOrgEvent(new OrganizationDependencyRemovingFailedEvent(event));
        }
    }

}
