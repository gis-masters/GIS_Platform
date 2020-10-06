package ru.mycrg.integration_service.domain;

import org.jetbrains.annotations.NotNull;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.IOrganizationEvent;
import ru.mycrg.auth_service_contract.OrganizationInitializedEvent;
import ru.mycrg.auth_service_contract.OrganizationRemovedEvent;
import ru.mycrg.integration_service.exceptions.QueueException;

@Service
public class RequestHandlerFactory {

    private final ApplicationContext context;

    public RequestHandlerFactory(ApplicationContext context) {
        this.context = context;
    }

    public IOrganizationRequestHandler getOrgHandler(@NotNull IOrganizationEvent mqEvent) throws QueueException {
        if (mqEvent instanceof OrganizationInitializedEvent) {
            return context.getBean(CreateOrganizationHandler.class);
        } else if (mqEvent instanceof OrganizationRemovedEvent) {
            return context.getBean(RemoveOrganizationHandler.class);
        } else {
            throw new QueueException("Not supported organization event");
        }
    }

}
