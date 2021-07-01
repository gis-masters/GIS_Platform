package ru.mycrg.audit_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.audit_service.entity.Event;

@Repository
public interface CrgAuditEventRepository extends PagingAndSortingRepository<Event, Long> {

    Page<Event> findAllByOrganizationId(Long id, Pageable pageable);

    Page<Event> findAllByOrganizationIdAndUserName(Long id, String userName, Pageable pageable);
}
