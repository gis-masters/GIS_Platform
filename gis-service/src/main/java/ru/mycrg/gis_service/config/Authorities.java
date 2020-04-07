package ru.mycrg.gis_service.config;

public class Authorities {

    public static final String GLOBAL_ADMIN = "GLOBAL_ADMIN";

    public static final String ORG_ADMIN = "ORG_ADMIN";
    public static final String USER = "USER";

    public static final String GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY =
            "hasAnyAuthority('" + GLOBAL_ADMIN + "', '" + ORG_ADMIN + "')";

    public static final String HAS_ANY_AUTHORITY =
            "hasAnyAuthority('" + GLOBAL_ADMIN + "', '" + ORG_ADMIN + "', '" + USER + "')";

}
