package ru.mycrg.acceptance.audit_service.dto;

public enum AuditEventActionsType {
    CREATE("CREATE"),
    UPDATE("UPDATE"),
    DELETE("DELETE"),
    SIGN_IN("SIGN_IN"),
    SIGN_OUT("SIGN_OUT"),
    MULTIPLE_DELETION("MULTIPLE_DELETION"),
    MULTIPLE_UPDATE("MULTIPLE_UPDATE");

    String value;

    AuditEventActionsType(String value) {
        this.value = value;
    }
}
