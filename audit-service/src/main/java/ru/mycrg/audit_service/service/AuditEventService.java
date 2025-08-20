package ru.mycrg.audit_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.audit_service.dto.EventFullProjection;
import ru.mycrg.audit_service.entity.Event;
import ru.mycrg.audit_service.exceptions.AuditServiceException;
import ru.mycrg.audit_service.repository.CrgAuditEventRepository;
import ru.mycrg.audit_service_contract.dto.AuditEventDto;
import ru.mycrg.auth_facade.IAuthenticationFacade;

@Service
@Transactional
public class AuditEventService {

    private final Logger log = LoggerFactory.getLogger(AuditEventService.class);

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

    public Page<EventFullProjection> getAllEvents(Pageable pageable, String aType, String eName, String eType) {
        if (authenticationFacade.isRoot()) {
            return auditRepository.findAll(pageable)
                                  .map(event -> projectionFactory.createProjection(EventFullProjection.class, event));
        } else if (authenticationFacade.isOrganizationAdmin()) {
            Long orgId = authenticationFacade.getOrganizationId();

            return auditRepository
                    .findAllByOrganizationIdWithSpecificFilter(orgId, aType, eName, eType, pageable)
                    .map(event -> projectionFactory.createProjection(EventFullProjection.class, event));
        } else {
            Long orgId = authenticationFacade.getOrganizationId();
            String userName = authenticationFacade.getLogin();

            return auditRepository
                    .findAllByOrganizationIdAndUserWithSpecificFilter(orgId, userName, aType, eName, eType, pageable)
                    .map(event -> projectionFactory.createProjection(EventFullProjection.class, event));
        }
    }

    public EventFullProjection addEvent(AuditEventDto eventDto) {
        log.debug("Попытка создания события аудита: {}", eventDto);

        Event newEvent;
        if (authenticationFacade.getOrganizationId() < 1) {
            newEvent = new Event(eventDto,
                                 authenticationFacade.getOrganizationId(),
                                 authenticationFacade.getLogin() == null ? "system" : authenticationFacade.getLogin());
        } else {
            newEvent = new Event(eventDto, authenticationFacade.getOrganizationId(), authenticationFacade.getLogin());
        }

        try {
            auditRepository.save(newEvent);

            return projectionFactory.createProjection(EventFullProjection.class, newEvent);
        } catch (Exception e) {
            throw new AuditServiceException("Не удалось добавить событие аудита => " + e.getMessage());
        }
    }
}
