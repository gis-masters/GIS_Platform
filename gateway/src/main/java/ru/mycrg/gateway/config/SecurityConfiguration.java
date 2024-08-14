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
import ru.mycrg.gateway.domain.Authenticator;
import ru.mycrg.gateway.domain.CookieProducer;
import ru.mycrg.gateway.domain.TokenHandler;
import ru.mycrg.gateway.filters.MainAuthFilter;
import ru.mycrg.gateway.queue.MessageBusProducer;

import javax.servlet.http.HttpServletResponse;
import java.util.Collections;

import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;

@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private CookieProducer cookieProducer;

    @Autowired
    private Authenticator authenticator;

    @Autowired
    private MessageBusProducer messageBus;

    @Autowired
    private TokenHandler tokenHandler;

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
                // handle an authorized attempts
                .exceptionHandling().authenticationEntryPoint(
                        (req, rsp, e) -> rsp.sendError(HttpServletResponse.SC_UNAUTHORIZED))
                .and()
                // Add a filter to validate the tokens with every request
                .addFilterAfter(new MainAuthFilter(cookieProducer, authenticator, messageBus, tokenHandler),
                                UsernamePasswordAuthenticationFilter.class)
                .authorizeRequests() // authorization requests config
                .antMatchers(POST,
                             "/oauth/token",
                             "/organizations/init",
                             "/organizations/intents",
                             "/perform_logout",
                             "/integration/ais_ums/import",
                             "/integration/statement/import",
                             "/request-password-reset",
                             "/password-reset").permitAll()
                .antMatchers(GET,
                             "/actuator/health",
                             "/password-reset",
                             "/specializations",
                             "/esia/**").permitAll()
                .anyRequest().authenticated(); // Any other request must be authenticated
    }
}
