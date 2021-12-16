package ru.mycrg.auth_service.service;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service.exceptions.AuthServiceException;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.oauth_client.JwtToken;
import ru.mycrg.oauth_client.OAuthClient;

@Service
public class AuthService {

    private final OAuthClient oAuthClient;

    private final String rootUserName;
    private final String rootUserPass;

    public AuthService(Environment environment, OAuthClient oAuthClient) {
        this.oAuthClient = oAuthClient;

        rootUserName = environment.getRequiredProperty("crg-options.root-user-name");
        rootUserPass = environment.getRequiredProperty("crg-options.root-user-password");
    }

    public String getRootAccessToken() {
        try {
            return oAuthClient.getToken(rootUserName, rootUserPass)
                              .getAccess_token();
        } catch (HttpClientException e) {
            throw new AuthServiceException("Error get root token");
        }
    }

    public JwtToken authorize(String name, String pass) {
        try {
            return oAuthClient.getToken(name, pass);
        } catch (HttpClientException e) {
            throw new AuthServiceException("Error to get token");
        }
    }
}
