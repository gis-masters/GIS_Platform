package ru.mycrg.gis_service.security;

public enum Roles {
    VIEWER(10L),
    CONTRIBUTOR(20L),
    OWNER(30L);

    private final Long value;

    Roles(Long value) {
        this.value = value;
    }

    public static Roles valueToRole(Long value) {
        for (Roles b: Roles.values()) {
            if (b.value.equals(value)) {
                return b;
            }
        }

        throw new IllegalArgumentException("Unexpected value '" + value + "'");
    }

    public static Roles stringToRole(String role) {
        if (role == null) {
            throw new IllegalArgumentException("Role string cannot be null");
        }

        for (Roles r: Roles.values()) {
            if (r.name().equalsIgnoreCase(role)) {
                return r;
            }
        }

        throw new IllegalArgumentException("Unexpected role string '" + role + "'");
    }

    public Long roleToValue() {
        return this.value;
    }
}
