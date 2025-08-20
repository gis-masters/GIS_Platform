package ru.mycrg.integration_service.queue.handlers;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.Variables;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.events.request.OrganizationInitializedEvent;
import ru.mycrg.auth_service_contract.events.response.OrganizationDependencyProvisionFailedEvent;
import ru.mycrg.messagebus_contract.IEventHandler;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import ru.mycrg.messagebus_contract.events.IMessageBusEvent;

import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.ITERATION_COUNTER_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.enums.BpmnProcessKey.CREATE_ORGANIZATION_PROCESS_ID;

/**
 * Сервис обрабатывающий событие создания организации.
 */
@Service
public class CreateOrganizationHandler implements IEventHandler {

    private final Logger log = LoggerFactory.getLogger(CreateOrganizationHandler.class);

    private final IMessageBusProducer messageBus;
    private final RuntimeService bpmnRuntimeService;

    public CreateOrganizationHandler(IMessageBusProducer messageBus,
                                     RuntimeService bpmnRuntimeService) {
        this.messageBus = messageBus;
        this.bpmnRuntimeService = bpmnRuntimeService;
    }

    @Override
    public String getEventType() {
        return OrganizationInitializedEvent.class.getSimpleName();
    }

    @Override
    public void handle(IMessageBusEvent event) {
        OrganizationInitializedEvent mqEvent = null;
        try {
            mqEvent = (OrganizationInitializedEvent) event;

            VariableMap variables = Variables
                    .createVariables()
                    .putValue(ITERATION_COUNTER_VAR_NAME, 3)
                    .putValue(EVENT_VAR_NAME, objectMapper.writeValueAsString(mqEvent));

            bpmnRuntimeService.startProcessInstanceByKey(
                    CREATE_ORGANIZATION_PROCESS_ID.getValue(),
                    mqEvent.getOrgId().toString(),
                    variables);
        } catch (Exception e) {
            log.error("Не удалось создать организацию на геосервере: ", e);

            messageBus.produce(new OrganizationDependencyProvisionFailedEvent(mqEvent));
        }
    }
}
