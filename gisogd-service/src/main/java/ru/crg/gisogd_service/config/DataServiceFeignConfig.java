package ru.crg.gisogd_service.config;

import feign.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.cloud.openfeign.security.OAuth2AccessTokenInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.http.*;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClient;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientService;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

/**
 * Feign client config.
 * @author Vladimir Nomokonov
 */
public class DataServiceFeignConfig {

    private OAuth2AccessToken accessToken;

    @Value("${spring.security.oauth2.client.provider.dataServiceClient.token-uri}")
    private String urlAuthService;
    @Value("${spring.security.oauth2.client.registration.dataServiceClient.client-id}")
    private String username;
    @Value("${spring.security.oauth2.client.registration.dataServiceClient.client-secret}")
    private String password;

    @Bean
    public Logger.Level feignLoggerLevel() {
        return Logger.Level.FULL;
    }

    @Bean
    @ConditionalOnBean({OAuth2AuthorizedClientService.class, ClientRegistrationRepository.class})
    @ConditionalOnMissingBean
    public OAuth2AuthorizedClientManager gisogdRfClientOAuth2AuthorizedClientManager(
            ClientRegistrationRepository clientRegistrationRepository) {
        //        return new AuthorizedClientServiceOAuth2AuthorizedClientManager(clientRegistrationRepository, oAuth2AuthorizedClientService);
        return authorizeRequest -> {
            String clientRegistrationId = authorizeRequest.getClientRegistrationId();
            ClientRegistration clientRegistration =
                    clientRegistrationRepository.findByRegistrationId(clientRegistrationId);
            OAuth2AccessToken accessToken = getAccessToken();
            return new OAuth2AuthorizedClient(clientRegistration, clientRegistrationId, accessToken);
        };
    }

    @Bean
    @ConditionalOnBean(OAuth2AuthorizedClientManager.class)
    public OAuth2AccessTokenInterceptor gisogdRfClientOAuth2AccessTokenInterceptor(
            OAuth2AuthorizedClientManager oAuth2AuthorizedClientManager) {
        return new OAuth2AccessTokenInterceptor("dataServiceClient", oAuth2AuthorizedClientManager);
    }

    private OAuth2AccessToken getAccessToken() {
        if (accessToken != null && accessToken.getExpiresAt().isAfter(Instant.now())) {
            return accessToken;
        }
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);
        headers.setCacheControl(CacheControl.noCache());
        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("grant_type", "password");
        map.add("username", username);
        map.add("password", password);

        HttpEntity<?> request = new HttpEntity<>(map, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(urlAuthService, request, String.class);
        if (response.getStatusCode().is2xxSuccessful()) {
            accessToken = new OAuth2AccessToken(OAuth2AccessToken.TokenType.BEARER, response.getBody(),
                                                Instant.now(), Instant.now().plus(30, ChronoUnit.MINUTES));
            return accessToken;
        }
        throw new RuntimeException(String.format("Can`t get access token for username: %s", username));
    }
}
