package ru.mycrg.auth_service.config;

public class Authorities {

    public static final String GLOBAL_ADMIN = "GLOBAL_ADMIN";

    public static final String ORG_ADMIN = "ORG_ADMIN";
    public static final String EDITOR = "EDITOR";
    public static final String VIEWER = "VIEWER";


    public static final String GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY =
            "hasAnyAuthority('" + GLOBAL_ADMIN + "', '" + ORG_ADMIN + "')";

}
