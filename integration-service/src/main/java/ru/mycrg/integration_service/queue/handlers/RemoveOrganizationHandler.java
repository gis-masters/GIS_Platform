package ru.mycrg.integration_service.queue.handlers;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.Variables;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.events.request.OrganizationRemovedEvent;
import ru.mycrg.auth_service_contract.events.response.OrganizationDependencyRemovingFailedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.enums.BpmnProcessKey.REMOVE_ORGANIZATION_PROCESS_ID;

/**
 * Сервис обрабатывающий событие создания организации.
 */
@Service
public class RemoveOrganizationHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(RemoveOrganizationHandler.class);

    private final IMessageBusProducer messageBus;
    private final RuntimeService bpmnRuntimeService;

    public RemoveOrganizationHandler(IMessageBusProducer messageBus,
                                     RuntimeService bpmnRuntimeService) {
        this.messageBus = messageBus;
        this.bpmnRuntimeService = bpmnRuntimeService;
    }

    @Override
    public String getEventType() {
        return OrganizationRemovedEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent event) {
        OrganizationRemovedEvent mqEvent = null;
        try {
            mqEvent = (OrganizationRemovedEvent) event;

            VariableMap variables = Variables
                    .createVariables()
                    .putValue(EVENT_VAR_NAME, objectMapper.writeValueAsString(mqEvent))
                    .putValue(ORG_ID_VAR_NAME, mqEvent.getOrgId())
                    .putValue(USERS_VAR_NAME, mqEvent.getGeoserverLogins())
                    .putValue(TOKEN_VAR_NAME, mqEvent.getRootToken());

            bpmnRuntimeService.startProcessInstanceByKey(
                    REMOVE_ORGANIZATION_PROCESS_ID.getValue(),
                    mqEvent.getOrgId().toString(),
                    variables);
        } catch (Exception e) {
            log.error("Не удалось стартовать процесс удаления организации: ", e);

            messageBus.produce(new OrganizationDependencyRemovingFailedEvent(mqEvent));
        }
    }
}
