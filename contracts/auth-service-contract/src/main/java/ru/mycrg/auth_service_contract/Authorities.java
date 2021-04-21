package ru.mycrg.auth_service_contract;

import javax.validation.constraints.NotNull;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class Authorities {

    public static final String GLOBAL_ADMIN = "GLOBAL_ADMIN";
    public static final String ORG_ADMIN = "ORG_ADMIN";
    public static final String USER = "USER";

    public static final String GLOBAL_ADMIN_AUTHORITY = "hasAuthority('" + GLOBAL_ADMIN + "')";
    public static final String ORG_ADMIN_AUTHORITY = "hasAnyAuthority('" + ORG_ADMIN + "')";
    public static final String GLOBAL_ADMIN_ORG_ADMIN_AUTHORITY =
            "hasAnyAuthority('" + GLOBAL_ADMIN + "', '" + ORG_ADMIN + "')";
    public static final String HAS_ANY_AUTHORITY =
            "hasAnyAuthority('" + GLOBAL_ADMIN + "', '" + ORG_ADMIN + "', '" + USER + "')";

    private static final List<String> builtInAuthorities = Collections.unmodifiableList(Arrays.asList(ORG_ADMIN, USER));

    private Authorities() {
        throw new IllegalStateException("Utility class");
    }

    public static boolean isAuthorityExist(@NotNull String authority) {
        return builtInAuthorities.contains(authority.toUpperCase());
    }

    public static List<String> getAuthorities() {
        return builtInAuthorities;
    }
}
