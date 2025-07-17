package ru.mycrg.gateway.config;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import ru.mycrg.gateway.domain.AuthMethod;
import ru.mycrg.gateway.domain.BearerHandler;
import ru.mycrg.gateway.domain.CookieHandler;
import ru.mycrg.gateway.domain.TokenHandler;
import ru.mycrg.oauth_client.OAuthClient;

import java.net.MalformedURLException;
import java.net.URL;

@Log4j2
@Configuration
public class CrgConfiguration {

    @Autowired
    private Environment environment;

    @Bean
    public OAuthClient authClient() throws MalformedURLException {
        URL authServiceUrl = new URL(environment.getRequiredProperty("crg-options.auth-service-url"));
        String clientId = environment.getRequiredProperty("crg-options.jwt.client-id");
        String clientSecret = environment.getRequiredProperty("crg-options.jwt.client-secret");

        return OAuthClient.builder()
                          .url(authServiceUrl)
                          .clientId(clientId)
                          .clientSecret(clientSecret)
                          .build();
    }

    @Bean
    public TokenHandler tokenHandler() {
        AuthMethod authMethod = AuthMethod.valueOf(environment.getRequiredProperty("crg-options.auth-method"));

        switch (authMethod) {
            case BEARER:
                return new BearerHandler();
            case COOKIE:
                return new CookieHandler();
            case BEARER_COOKIE:
                return new BearerHandler(new CookieHandler());
            case COOKIE_BEARER:
                return new CookieHandler(new BearerHandler());
            default:
                log.info("Auth method not defined, will use default: cookie is primary");

                return new CookieHandler(new BearerHandler());
        }
    }
}
