package ru.mycrg.auth_service.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class AuthorityService {

    // Built-in roles
    public static final String GLOBAL_ADMIN = "GLOBAL_ADMIN";

    public static final String ORG_ADMIN = "ORG_ADMIN";
    public static final String USER = "USER";

    private List<String> builtInAuthorities = Arrays.asList(ORG_ADMIN, USER);

    public AuthorityService() {
    }

    public boolean isAuthorityExist(@NotNull String authority) {
        return builtInAuthorities.contains(authority.toUpperCase());
    }

    public List<String> getAuthorities() {
        return builtInAuthorities;
    }

}
