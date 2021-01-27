package ru.mycrg.auth_service.queue;

import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service.exceptions.QueueException;
import ru.mycrg.auth_service.service.*;
import ru.mycrg.auth_service_contract.*;

@Service
public class ResponseHandlerFactory {

    private final ApplicationContext context;

    public ResponseHandlerFactory(ApplicationContext context) {
        this.context = context;
    }

    public IResponseHandler getHandler(IAuthServiceEvent mqEvent) throws QueueException {
        if (mqEvent instanceof OrganizationDependencyProvisionSucceededEvent) {
            return context.getBean(OrgDepProvisionSuccessEventHandler.class);
        } else if (mqEvent instanceof OrganizationDependencyProvisionFailedEvent) {
            return context.getBean(OrgDepProvisionFailedEventHandler.class);
        } else if (mqEvent instanceof OrganizationDependencyRemovingSucceededEvent) {
            return context.getBean(OrgDepRemovingSuccessEventHandler.class);
        } else if (mqEvent instanceof OrganizationDependencyRemovingFailedEvent) {
            return context.getBean(OrgDepRemovingFailedEventHandler.class);
        } else if (mqEvent instanceof UserProvisioningSucceedEvent) {
            return context.getBean(UserProvisioningSucceedEventHandler.class);
        } else if (mqEvent instanceof UserProvisioningFailedEvent) {
            return context.getBean(UserProvisioningFailedEventHandler.class);
        } else {
            throw new QueueException("Not supported event");
        }
    }
}
