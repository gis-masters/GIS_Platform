package ru.mycrg.auth_facade;

import org.springframework.security.core.Authentication;

public interface IAuthenticationFacade {

    String getAccessToken();

    String getLogin();

    String getGeoserverLogin();

    boolean isRoot();

    boolean isOrganizationAdmin();

    Long getOrganizationId();

    Long getOrganizationId(Authentication authentication);

    UserDetails getUserDetails();
}
