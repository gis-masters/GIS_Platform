package ru.mycrg.auth_service.config;

import static ru.mycrg.auth_service.service.AuthorityService.GLOBAL_ADMIN;
import static ru.mycrg.auth_service.service.AuthorityService.ORG_ADMIN;

public class Authorities {

    public static final String GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY =
            "hasAnyAuthority('" + GLOBAL_ADMIN + "', '" + ORG_ADMIN + "')";

    public static final String GLOBAL_ADMIN_AUTHORITY = "hasAuthority('" + GLOBAL_ADMIN + "')";

}
