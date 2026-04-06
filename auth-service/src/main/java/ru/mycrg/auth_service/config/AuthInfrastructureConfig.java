package ru.mycrg.auth_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.mycrg.auth_service_contract.AESCryptor;
import ru.mycrg.oauth_client.OAuthClient;

import javax.crypto.NoSuchPaddingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.security.NoSuchAlgorithmException;

@Configuration
public class AuthInfrastructureConfig {

    @Value("${security.jwt.client_id}")
    private String clientId;

    @Value("${security.jwt.client_secret}")
    private String clientSecret;

    @Bean
    public OAuthClient oAuthClient() throws MalformedURLException {
        return OAuthClient.builder()
                          .url(new URL("http://localhost:9000"))
                          .clientId(clientId)
                          .clientSecret(clientSecret)
                          .build();
    }

    @Bean
    AESCryptor aes() throws NoSuchAlgorithmException, NoSuchPaddingException {
        return new AESCryptor(clientSecret);
    }
}
