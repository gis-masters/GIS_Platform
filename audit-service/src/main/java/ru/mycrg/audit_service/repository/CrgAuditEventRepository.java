package ru.mycrg.audit_service.repository;

import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.audit_service.entity.AuditEventEntity;

@Repository
public interface CrgAuditEventRepository extends PagingAndSortingRepository<AuditEventEntity, Long> {

}
