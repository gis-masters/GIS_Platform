package ru.mycrg.gis_service.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import ru.mycrg.oauth_client.OAuthClient;

import java.net.MalformedURLException;
import java.net.URL;

@Configuration
public class CrgBeansConfig {

    @Autowired
    private Environment environment;

    @Bean
    public OAuthClient oAuthClient() throws MalformedURLException {
        String authServiceUrl = environment.getRequiredProperty("crg-options.auth-service-url");
        String clientId = environment.getRequiredProperty("crg-options.jwt.client_id");
        String clientSecret = environment.getRequiredProperty("crg-options.jwt.client_secret");

        return OAuthClient.builder()
                          .url(new URL(authServiceUrl))
                          .clientId(clientId)
                          .clientSecret(clientSecret)
                          .build();
    }
}
