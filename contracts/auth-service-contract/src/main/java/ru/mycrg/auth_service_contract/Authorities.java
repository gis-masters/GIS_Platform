package ru.mycrg.auth_service_contract;

public class Authorities {

    private Authorities() {
        throw new IllegalStateException("Utility class");
    }

    public static final String GLOBAL_ADMIN = "GLOBAL_ADMIN";

    public static final String ORG_ADMIN = "ORG_ADMIN";
    public static final String USER = "USER";

    public static final String GLOBAL_ADMIN_AUTHORITY = "hasAuthority('" + GLOBAL_ADMIN + "')";
    public static final String ORG_ADMIN_AUTHORITY = "hasAnyAuthority('" + ORG_ADMIN + "')";
    public static final String GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY =
            "hasAnyAuthority('" + GLOBAL_ADMIN + "', '" + ORG_ADMIN + "')";
    public static final String HAS_ANY_AUTHORITY =
            "hasAnyAuthority('" + GLOBAL_ADMIN + "', '" + ORG_ADMIN + "', '" + USER + "')";
}
