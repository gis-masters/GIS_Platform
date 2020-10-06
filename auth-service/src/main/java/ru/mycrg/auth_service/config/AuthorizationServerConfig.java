package ru.mycrg.auth_service.config;

import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.config.annotation.configurers.ClientDetailsServiceConfigurer;
import org.springframework.security.oauth2.config.annotation.web.configuration.AuthorizationServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableAuthorizationServer;
import org.springframework.security.oauth2.config.annotation.web.configurers.AuthorizationServerEndpointsConfigurer;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;
import ru.mycrg.auth_service.security.CustomTokenConverter;
import ru.mycrg.oauth_client.OAuthClient;

import java.net.MalformedURLException;
import java.net.URL;

@Log4j2
@Configuration
@EnableAuthorizationServer
public class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {

    @Value("${security.jwt.secret:vjp4lLW_QmjMHiUw1OBVRIZH}")
    private String SECRET;

    @Value("${security.jwt.client_id:admin}")
    private String CLIENT_ID;

    @Value("${security.jwt.client_secret:geoserver}")
    private String CLIENT_SECRET;

    @Value("#{ '${security.jwt.access_token_validity_seconds}'.isEmpty() " +
            "? 86400 : '${security.jwt.access_token_validity_seconds}' }")
    private Integer ACCESS_TOKEN_VALIDITY_TIME;

    @Value("#{ '${security.jwt.refresh_token_validity_seconds}'.isEmpty() " +
            "? 1209600 : '${security.jwt.refresh_token_validity_seconds}' }")
    private Integer REFRESH_TOKEN_VALIDITY_TIME;

    private final BCryptPasswordEncoder encoder;
    private final AuthenticationManager authenticationManager;

    @Autowired
    public AuthorizationServerConfig(AuthenticationManager authenticationManager,
                                     BCryptPasswordEncoder encoder) {
        this.authenticationManager = authenticationManager;
        this.encoder = encoder;
    }

    @Override
    public void configure(ClientDetailsServiceConfigurer clients) throws Exception {
        log.debug("Setup access/refresh tokens time in sec: {} / {}",
                ACCESS_TOKEN_VALIDITY_TIME,
                REFRESH_TOKEN_VALIDITY_TIME);

        clients
                .inMemory()
                .withClient(CLIENT_ID)
                .secret(encoder.encode(CLIENT_SECRET))
                .accessTokenValiditySeconds(ACCESS_TOKEN_VALIDITY_TIME)
                .refreshTokenValiditySeconds(REFRESH_TOKEN_VALIDITY_TIME)
                .scopes("crg")
                .authorizedGrantTypes("password", "refresh_token");
    }

    @Override
    public void configure(AuthorizationServerEndpointsConfigurer endpoints) {
        endpoints
                .tokenStore(tokenStore())
                .authenticationManager(authenticationManager)
                .accessTokenConverter(accessTokenConverter());
    }

    @Bean
    public JwtAccessTokenConverter accessTokenConverter() {
        CustomTokenConverter converter = new CustomTokenConverter();
        converter.setSigningKey(SECRET);

        return converter;
    }

    @Bean
    public TokenStore tokenStore() {
        return new JwtTokenStore(accessTokenConverter());
    }

    @Bean
    public OAuthClient oAuthClient() throws MalformedURLException {
        return OAuthClient.builder()
                .url(new URL("http://localhost:9000"))
                .clientId(CLIENT_ID)
                .clientSecret(CLIENT_SECRET)
                .build();
    }
}
