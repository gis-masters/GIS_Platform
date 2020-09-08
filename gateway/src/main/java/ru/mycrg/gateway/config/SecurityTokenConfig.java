package ru.mycrg.gateway.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import ru.mycrg.gateway.domain.BearerHandler;
import ru.mycrg.gateway.domain.CookieHandler;
import ru.mycrg.gateway.filters.MainAuthFilter;

import javax.servlet.http.HttpServletResponse;
import java.util.Collections;

import static org.springframework.http.HttpMethod.POST;

@EnableWebSecurity
public class SecurityTokenConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private CookieHandler cookieHandler;

    @Autowired
    private BearerHandler bearerHandler;

    @Autowired
    private CrgProperties properties;

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Collections.singletonList("*"));
        configuration.setAllowedMethods(Collections.singletonList("*"));
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .cors().and()
            .csrf().disable()
                // make sure we use stateless session; session won't be used to store user's state.
                .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            .and()
                .logout()
                .deleteCookies(cookieHandler.getCookieName())
            .and()
                // handle an authorized attempts
                .exceptionHandling().authenticationEntryPoint((req, rsp, e) -> rsp.sendError(HttpServletResponse.SC_UNAUTHORIZED))
            .and()
                // Add a filter to validate the tokens with every request
                .addFilterAfter(new MainAuthFilter(cookieHandler, bearerHandler, properties),
                        UsernamePasswordAuthenticationFilter.class)
            .authorizeRequests() // authorization requests config
                .antMatchers(POST, "/oauth/token", "/organizations/init").permitAll()
                .anyRequest().authenticated(); // Any other request must be authenticated
    }
}
