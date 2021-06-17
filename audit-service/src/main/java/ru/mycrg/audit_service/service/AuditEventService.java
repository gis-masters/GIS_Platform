package ru.mycrg.audit_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.audit_service.entity.AuditEventEntity;
import ru.mycrg.audit_service.repository.CrgAuditEventRepository;

import javax.transaction.Transactional;

@Service
@Transactional
public class AuditEventService {

    private static final Logger log = LoggerFactory.getLogger(AuditEventService.class);

    private final CrgAuditEventRepository auditRepository;

    public AuditEventService(CrgAuditEventRepository auditRepository) {
        this.auditRepository = auditRepository;
    }

    public void addEvent(AuditEventEntity auditEventEntity) {
        log.debug("Request create audit: {}", auditEventEntity.getEventDateTime());
        auditRepository.save(auditEventEntity);
    }
}
