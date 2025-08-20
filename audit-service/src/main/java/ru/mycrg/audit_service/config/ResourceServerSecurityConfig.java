package ru.mycrg.audit_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.oauth2.config.annotation.web.configuration.EnableResourceServer;
import org.springframework.security.oauth2.config.annotation.web.configuration.ResourceServerConfigurerAdapter;
import org.springframework.security.oauth2.config.annotation.web.configurers.ResourceServerSecurityConfigurer;
import org.springframework.security.oauth2.provider.token.TokenStore;
import org.springframework.security.oauth2.provider.token.store.JwtAccessTokenConverter;
import org.springframework.security.oauth2.provider.token.store.JwtTokenStore;
import ru.mycrg.auth_facade.AuthenticationFacade;
import ru.mycrg.auth_facade.IAuthenticationFacade;

import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;

@Configuration
@EnableResourceServer
public class ResourceServerSecurityConfig extends ResourceServerConfigurerAdapter {

    @Value("${security.jwt.secret}")
    private String secret;

    private final CustomAccessTokenConverter customAccessTokenConverter;

    public ResourceServerSecurityConfig(CustomAccessTokenConverter customAccessTokenConverter) {
        this.customAccessTokenConverter = customAccessTokenConverter;
    }

    @Bean
    public JwtAccessTokenConverter accessTokenConverter() {
        JwtAccessTokenConverter converter = new JwtAccessTokenConverter();
        converter.setAccessTokenConverter(customAccessTokenConverter);
        converter.setSigningKey(secret);

        return converter;
    }

    @Bean
    public TokenStore tokenStore() {
        return new JwtTokenStore(accessTokenConverter());
    }

    @Override
    public void configure(ResourceServerSecurityConfigurer configurer) {
        configurer
                .resourceId("audit-service")
                .tokenStore(tokenStore());
    }

    @Override
    public void configure(HttpSecurity http) throws Exception {
        http
                .cors().and()
                .csrf().disable()
                .authorizeRequests()
                .antMatchers(GET, "/actuator/health").permitAll()
                .antMatchers(POST, "/events").permitAll()
                .anyRequest().authenticated();
    }

    @Bean
    IAuthenticationFacade authenticationFacade() {
        return new AuthenticationFacade();
    }
}
