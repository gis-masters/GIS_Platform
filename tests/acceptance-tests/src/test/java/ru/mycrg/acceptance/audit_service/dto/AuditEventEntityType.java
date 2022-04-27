package ru.mycrg.acceptance.audit_service.dto;

public enum AuditEventEntityType {
    PROJECT("PROJECT"),
    LAYER("LAYER"),
    LIBRARY_RECORD("LIBRARY_RECORD"),
    PERMISSION("PERMISSION"),
    DATASET("DATASET"),
    FEATURE("FEATURE"),
    TABLE("TABLE");

    String value;

    AuditEventEntityType(String value) {
        this.value = value;
    }
}
