package ru.mycrg.acceptance.audit_service.dto;

public enum AuditEventActionsType {
    CREATE("CREATE"),
    UPDATE("UPDATE"),
    DELETE("DELETE"),
    SIGN_IN("SIGN_IN"),
    SIGN_OUT("SIGN_OUT"),
    SIGN_FAIL("SIGN_FAIL"),
    MULTIPLE_DELETION("MULTIPLE_DELETION"),
    MULTIPLE_UPDATE("MULTIPLE_UPDATE"),
    COPYING("COPYING"),
    INVITE("INVITE");

    String value;

    AuditEventActionsType(String value) {
        this.value = value;
    }
}
