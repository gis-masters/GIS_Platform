package ru.mycrg.gis_service.security;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.gis_service.exceptions.GisServiceException;
import ru.mycrg.oauth_client.OAuthClient;

@Service
public class CrgAuthHandler {

    private final OAuthClient oAuthClient;
    private final Environment environment;

    public CrgAuthHandler(OAuthClient oAuthClient, Environment environment) {
        this.oAuthClient = oAuthClient;
        this.environment = environment;
    }

    public String getRootAccessToken() {
        try {
            String systemAdminLogin = environment.getRequiredProperty("crg-options.system-admin-login");
            String systemAdminPassword = environment.getRequiredProperty("crg-options.system-admin-password");

            return oAuthClient.getToken(systemAdminLogin, systemAdminPassword)
                              .getAccess_token();
        } catch (Exception e) {
            throw new GisServiceException("Error get root token");
        }
    }
}
