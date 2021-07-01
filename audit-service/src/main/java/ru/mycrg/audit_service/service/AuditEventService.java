package ru.mycrg.audit_service.service;

import dto.AuditEventDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.audit_service.dto.EventFullProjection;
import ru.mycrg.audit_service.entity.Event;
import ru.mycrg.audit_service.exceptions.AuditServiceException;
import ru.mycrg.audit_service.repository.CrgAuditEventRepository;
import ru.mycrg.audit_service.security.IAuthenticationFacade;

import javax.transaction.Transactional;

@Service
@Transactional
public class AuditEventService {

    private static final Logger log = LoggerFactory.getLogger(AuditEventService.class);

    private final CrgAuditEventRepository auditRepository;
    private final IAuthenticationFacade authenticationFacade;
    private final ProjectionFactory projectionFactory;

    public AuditEventService(CrgAuditEventRepository auditRepository,
                             IAuthenticationFacade authenticationFacade,
                             ProjectionFactory projectionFactory) {
        this.auditRepository = auditRepository;
        this.authenticationFacade = authenticationFacade;
        this.projectionFactory = projectionFactory;
    }

    public Page<EventFullProjection> getAllEvents(Pageable pageable) {
        if (authenticationFacade.isRoot()) {
            log.debug("Get all events by Root");

            return auditRepository.findAll(pageable)
                                  .map(event -> projectionFactory.createProjection(EventFullProjection.class, event));
        } else if (authenticationFacade.isOrganizationAdmin()) {
            log.debug("Get all events by Organization Admin");
            Long orgId = authenticationFacade.getOrganizationId();

            return auditRepository.findAllByOrganizationId(orgId, pageable)
                                  .map(event -> projectionFactory.createProjection(EventFullProjection.class, event));
        } else {
            log.debug("Get all events by User");
            Long orgId = authenticationFacade.getOrganizationId();
            String userName = authenticationFacade.getLogin();

            return auditRepository.findAllByOrganizationIdAndUserName(orgId, userName, pageable)
                                  .map(event -> projectionFactory.createProjection(EventFullProjection.class, event));
        }
    }

    public EventFullProjection addEvent(AuditEventDto eventDto) {
        log.debug("Request create audit: {}", eventDto);

        try {
            Event newEvent = new Event(eventDto, authenticationFacade.getOrganizationId(),
                                       authenticationFacade.getLogin());
            auditRepository.save(newEvent);

            return projectionFactory.createProjection(EventFullProjection.class, newEvent);
        } catch (Exception e) {
            throw new AuditServiceException("Failed add audit: " + e.getMessage());
        }
    }
}
