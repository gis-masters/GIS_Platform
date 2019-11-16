package ru.mycrg.auth.config;

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

@Configuration
@EnableAuthorizationServer
public class AuthorizationServerConfig extends AuthorizationServerConfigurerAdapter {

    @Value("${security.jwt.secret:vjp4lLW_QmjMHiUw1OBVRIZH}")
    private String SECRET;

    @Value("${security.jwt.admin_name:admin}")
    private String ADMIN_NAME;

    @Value("${security.jwt.admin_pass:geoserver}")
    private String ADMIN_PASS;

    private static final int ACCESS_TOKEN_VALIDITY_TIME = 60 * 60 * 24;
    private static final int REFRESH_TOKEN_VALIDITY_TIME = 60 * 60 * 24 * 14;

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
        clients
                .inMemory()
                .withClient(ADMIN_NAME)
                .secret(encoder.encode(ADMIN_PASS))
                .accessTokenValiditySeconds(ACCESS_TOKEN_VALIDITY_TIME)
                .refreshTokenValiditySeconds(REFRESH_TOKEN_VALIDITY_TIME)
                .scopes("read", "write")
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
        JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
        converter.setSigningKey(SECRET);

        return converter;
    }

    @Bean
    public TokenStore tokenStore() {
        return new JwtTokenStore(accessTokenConverter());
    }

}
