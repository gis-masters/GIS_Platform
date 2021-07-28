package ru.mycrg.acceptance.audit_service.dto;

public enum AuditEventEntityType {
    PROJECT("PROJECT"),
    LAYER("LAYER");

    String value;

    AuditEventEntityType(String value) {
        this.value = value;
    }
}
