package ru.mycrg.integration_service.domain;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.Variables;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.IOrganizationEvent;
import ru.mycrg.auth_service_contract.OrganizationDependencyProvisionFailedEvent;
import ru.mycrg.auth_service_contract.OrganizationInitializedEvent;
import ru.mycrg.integration_service.queue.MessageBusSender;

import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.CREATE_ORGANIZATION_PROCESS_ID;

/**
 * Сервис обрабатывающий событие создания организации.
 */
@Service
public class CreateOrganizationHandler implements IOrganizationRequestHandler {

    private final Logger log = LoggerFactory.getLogger(CreateOrganizationHandler.class);

    private final MessageBusSender messageBus;
    private final RuntimeService bpmnRuntimeService;

    public CreateOrganizationHandler(MessageBusSender messageBus,
                                     RuntimeService bpmnRuntimeService) {
        this.messageBus = messageBus;
        this.bpmnRuntimeService = bpmnRuntimeService;
    }

    @Override
    public void handle(IOrganizationEvent event) {
        try {
            OrganizationInitializedEvent mqEvent = (OrganizationInitializedEvent) event;

            VariableMap variables = Variables
                    .createVariables()
                    .putValue(EVENT_VAR_NAME, objectMapper.writeValueAsString(mqEvent));

            bpmnRuntimeService.startProcessInstanceByKey(
                    CREATE_ORGANIZATION_PROCESS_ID,
                    mqEvent.getOrgId().toString(),
                    variables);
        } catch (Exception e) {
            log.error("Не удалось создать организацию на геосервере: ", e);

            messageBus.sendOrgEvent(new OrganizationDependencyProvisionFailedEvent(event));
        }
    }

}
