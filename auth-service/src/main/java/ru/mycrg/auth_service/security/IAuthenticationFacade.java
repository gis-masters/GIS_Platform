package ru.mycrg.auth_service.security;

import org.springframework.security.core.Authentication;

public interface IAuthenticationFacade {

    Authentication getAuthentication();

    String getAccessToken();

    String getLogin();

    boolean isRoot();

    boolean isOrganizationAdmin();

    Long getOrganizationId();

    Long getOrganizationId(Authentication authentication);

    UserDetails getUserDetails();
}
