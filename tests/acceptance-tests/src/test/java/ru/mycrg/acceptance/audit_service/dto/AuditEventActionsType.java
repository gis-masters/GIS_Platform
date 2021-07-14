package ru.mycrg.acceptance.audit_service.dto;

public enum AuditEventActionsType {
    CREATE("CREATE"),
    UPDATE("UPDATE"),
    DELETE("DELETE"),
    SIGN_IN("SIGN_IN"),
    SIGN_OUT("SIGN_OUT");

    String value;

    AuditEventActionsType(String value) {
        this.value = value;
    }
}
