package ru.mycrg.gis_service.security;

import org.jetbrains.annotations.NotNull;
import org.springframework.security.oauth2.provider.OAuth2Authentication;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;

import java.security.Principal;

public class CrgAuthHelper {

    @NotNull
    public static String getToken(@NotNull Principal principal) {
        Object details = ((OAuth2Authentication) principal).getDetails();

        if (details != null) {
            return ((OAuth2AuthenticationDetails) details).getTokenValue();
        } else {
            return "";
        }
    }
}
