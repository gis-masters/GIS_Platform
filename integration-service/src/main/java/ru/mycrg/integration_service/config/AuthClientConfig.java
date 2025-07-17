package ru.mycrg.integration_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import ru.mycrg.oauth_client.OAuthClient;

import java.net.MalformedURLException;
import java.net.URL;

@Configuration
public class AuthClientConfig {

    private final Environment environment;

    public AuthClientConfig(Environment environment) {
        this.environment = environment;
    }

    @Bean
    public OAuthClient oAuthClient() throws MalformedURLException {
        String authServiceUrl = environment.getRequiredProperty("crg-options.auth_service_url");
        String clientId = environment.getRequiredProperty("crg-options.jwt.client_id");
        String clientSecret = environment.getRequiredProperty("crg-options.jwt.client_secret");

        return OAuthClient.builder()
                          .url(new URL(authServiceUrl))
                          .clientId(clientId)
                          .clientSecret(clientSecret)
                          .build();
    }
}
