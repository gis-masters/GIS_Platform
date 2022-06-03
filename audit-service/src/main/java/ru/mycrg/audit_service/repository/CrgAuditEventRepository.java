package ru.mycrg.audit_service.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;
import ru.mycrg.audit_service.entity.Event;

@Repository
public interface CrgAuditEventRepository extends PagingAndSortingRepository<Event, Long> {

    @Query(value = "SELECT * FROM audit_events as e " +
            "WHERE e.organization_id = :orgId " +
            "AND e.action_type ILIKE %:actionType% " +
            "AND e.entity_name ILIKE %:entityName% " +
            "AND e.entity_type ILIKE %:entityType%",
           countQuery = "SELECT count(*) FROM audit_events as e " +
                   "WHERE e.organization_id = :orgId " +
                   "AND e.action_type ILIKE %:actionType% " +
                   "AND e.entity_name ILIKE %:entityName% " +
                   "AND e.entity_type ILIKE %:entityType%",
           nativeQuery = true)
    Page<Event> findAllByOrganizationIdWithSpecificFilter(Long orgId,
                                                          String actionType,
                                                          String entityName,
                                                          String entityType,
                                                          Pageable pageable);

    @Query(value = "SELECT * FROM audit_events as e " +
            "WHERE e.organization_id = :orgId " +
            "AND e.user_name = :userName " +
            "AND e.action_type ILIKE %:actionType% " +
            "AND e.entity_name ILIKE %:entityName% " +
            "AND e.entity_type ILIKE %:entityType%",
           countQuery = "SELECT count(*) FROM audit_events as e " +
                   "WHERE e.organization_id = :orgId " +
                   "AND e.user_name = :userName " +
                   "AND e.action_type ILIKE %:actionType% " +
                   "AND e.entity_name ILIKE %:entityName% " +
                   "AND e.entity_type ILIKE %:entityType%",
           nativeQuery = true)
    Page<Event> findAllByOrganizationIdAndUserWithSpecificFilter(Long orgId,
                                                                 String userName,
                                                                 String actionType,
                                                                 String entityName,
                                                                 String entityType,
                                                                 Pageable pageable);
}
