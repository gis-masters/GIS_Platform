package ru.mycrg.gateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import ru.mycrg.gateway.domain.Authenticator;
import ru.mycrg.gateway.domain.CookieProducer;
import ru.mycrg.gateway.domain.TokenHandler;
import ru.mycrg.gateway.filters.MainAuthFilter;
import ru.mycrg.gateway.queue.MessageBusProducer;

import jakarta.servlet.http.HttpServletResponse;
import java.util.List;

import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    private final CookieProducer cookieProducer;
    private final Authenticator authenticator;
    private final MessageBusProducer messageBus;
    private final TokenHandler tokenHandler;

    public SecurityConfiguration(CookieProducer cookieProducer,
                                 Authenticator authenticator,
                                 MessageBusProducer messageBus,
                                 TokenHandler tokenHandler) {
        this.cookieProducer = cookieProducer;
        this.authenticator = authenticator;
        this.messageBus = messageBus;
        this.tokenHandler = tokenHandler;
    }

    @Bean
    public MainAuthFilter mainAuthFilter() {
        return new MainAuthFilter(cookieProducer, authenticator, messageBus, tokenHandler);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("*"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, MainAuthFilter mainAuthFilter) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exceptionHandling -> exceptionHandling.authenticationEntryPoint(
                        (req, rsp, e) -> rsp.sendError(HttpServletResponse.SC_UNAUTHORIZED)))
                .addFilterAfter(mainAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(POST,
                                         "/oauth/token",
                                         "/organizations/init",
                                         "/organizations/intents",
                                         "/perform_logout",
                                         "/integration/statement/import",
                                         "/request-password-reset",
                                         "/password-reset").permitAll()
                        .requestMatchers(GET,
                                         "/actuator/health",
                                         "/password-reset",
                                         "/password-reset-token/**",
                                         "/specializations",
                                         "/esia/**").permitAll()
                        .anyRequest().authenticated());

        return http.build();
    }
}
