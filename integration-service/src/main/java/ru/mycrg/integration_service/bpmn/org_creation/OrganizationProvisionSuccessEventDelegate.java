package ru.mycrg.integration_service.bpmn.org_creation;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.OrganizationDependencyProvisionSucceededEvent;
import ru.mycrg.auth_service_contract.OrganizationInitializedEvent;
import ru.mycrg.integration_service.queue.MessageBusSender;

import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_VAR_NAME;

@Service
public class OrganizationProvisionSuccessEventDelegate implements JavaDelegate {

    private final MessageBusSender messageBusSender;

    public OrganizationProvisionSuccessEventDelegate(MessageBusSender messageBusSender) {
        this.messageBusSender = messageBusSender;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final Object jsonString = execution.getVariable(EVENT_VAR_NAME);

        OrganizationInitializedEvent event =
                objectMapper.readValue((String) jsonString, OrganizationInitializedEvent.class);

        messageBusSender.sendOrgEvent(new OrganizationDependencyProvisionSucceededEvent(event));
    }
}
