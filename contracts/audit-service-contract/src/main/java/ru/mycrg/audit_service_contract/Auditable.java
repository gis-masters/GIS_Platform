package ru.mycrg.audit_service_contract;

import ru.mycrg.audit_service_contract.events.CrgAuditEvent;

public interface Auditable {

    CrgAuditEvent getEvent();
}
