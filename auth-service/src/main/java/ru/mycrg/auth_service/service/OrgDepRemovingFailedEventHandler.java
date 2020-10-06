package ru.mycrg.auth_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service.queue.IResponseHandler;
import ru.mycrg.auth_service_contract.IAuthServiceEvent;
import ru.mycrg.auth_service_contract.IOrganizationEvent;
import ru.mycrg.auth_service_contract.OrganizationDependencyRemovingFailedEvent;

import javax.transaction.Transactional;

@Service
@Transactional
public class OrgDepRemovingFailedEventHandler implements IResponseHandler {

    private static final Logger log = LoggerFactory.getLogger(OrgDepRemovingFailedEventHandler.class);

    public OrgDepRemovingFailedEventHandler() {
    }

    public void handle(IAuthServiceEvent mqEvent) {
        final IOrganizationEvent event = (OrganizationDependencyRemovingFailedEvent) mqEvent;

        log.debug("Organization {}, NOT deleted.", event.getOrgId());
    }
}
