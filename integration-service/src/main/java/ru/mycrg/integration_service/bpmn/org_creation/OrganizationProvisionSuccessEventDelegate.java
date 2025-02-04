package ru.mycrg.integration_service.bpmn.org_creation;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.events.request.OrganizationInitializedEvent;
import ru.mycrg.auth_service_contract.events.response.OrganizationDependencyProvisionSucceededEvent;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.VariableUtil.getVariable;

@Service
public class OrganizationProvisionSuccessEventDelegate implements JavaDelegate {

    private final IMessageBusProducer messageBus;

    public OrganizationProvisionSuccessEventDelegate(IMessageBusProducer messageBus) {
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final Object jsonString = getVariable(execution, EVENT_VAR_NAME, getClass().getName());

        OrganizationInitializedEvent event =
                objectMapper.readValue((String) jsonString, OrganizationInitializedEvent.class);

        messageBus.produce(new OrganizationDependencyProvisionSucceededEvent(event));
    }
}
