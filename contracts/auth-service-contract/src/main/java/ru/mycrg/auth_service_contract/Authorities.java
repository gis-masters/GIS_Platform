package ru.mycrg.auth_service_contract;

import javax.validation.constraints.NotNull;
import java.util.List;

public class Authorities {

    /**
     * Администратор системы.
     */
    public static final String SYSTEM_ADMIN = "SYSTEM_ADMIN";

    /**
     * Владелец организации.
     */
    public static final String ORG_ADMIN = "ORG_ADMIN";

    /**
     * Рядовой пользователь.
     */
    public static final String USER = "USER";

    public static final String SYSTEM_ADMIN_AUTHORITY = "hasAuthority('" + SYSTEM_ADMIN + "')";
    public static final String ORG_ADMIN_AUTHORITY = "hasAnyAuthority('" + ORG_ADMIN + "')";
    public static final String SYSTEM_ADMIN_ORG_ADMIN_AUTHORITY =
            "hasAnyAuthority('" + SYSTEM_ADMIN + "', '" + ORG_ADMIN + "')";
    public static final String HAS_ANY_AUTHORITY =
            "hasAnyAuthority('" + SYSTEM_ADMIN + "', '" + ORG_ADMIN + "', '" + USER + "')";

    private static final List<String> builtInAuthorities = List.of(ORG_ADMIN, USER);

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
