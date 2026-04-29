package ru.mycrg.auth_service.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.provisioning.JdbcUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import ru.mycrg.auth_facade.AuthenticationFacade;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.jwt_support.JwtAuthenticationFilter;
import ru.mycrg.jwt_support.JwtTokenKinds;

import javax.sql.DataSource;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Collections;

import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private static final String[] SWAGGER_WHITELIST = {
            "/v2/api-docs",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger-ui.html",
            "/webjars/**"
    };

    private static final String USERS_BY_USERNAME_QUERY =
            "WITH result AS (" +
                    "    SELECT lower(trim(?)) AS universal_login" +
                    ")" +
                    "SELECT login, password, enabled" +
                    "  FROM users" +
                    "  WHERE lower(login) IN (SELECT universal_login FROM result)" +
                    "   OR lower(geoserver_login) IN (SELECT universal_login FROM result)";

    private static final String AUTHORITIES_BY_USERNAME_QUERY =
            "WITH result AS (SELECT lower(trim(?)) AS universal_login)" +
                    " SELECT U.login, A.authority" +
                    " FROM users AS U" +
                    "         INNER JOIN authorities AS A ON U.id = A.user_id" +
                    " WHERE lower(U.login) IN (SELECT universal_login FROM result)" +
                    "   OR lower(U.geoserver_login) IN (SELECT universal_login FROM result)";

    @Value("${spring.datasource.url:jdbc:postgresql://127.0.0.1:5432/gis_portal}")
    private String jdbcUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Bean
    public BCryptPasswordEncoder encoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(DataSource dataSource) {
        JdbcUserDetailsManager manager = new JdbcUserDetailsManager(dataSource);
        manager.setUsersByUsernameQuery(USERS_BY_USERNAME_QUERY);
        manager.setAuthoritiesByUsernameQuery(AUTHORITIES_BY_USERNAME_QUERY);

        return manager;
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(UserDetailsService userDetailsService,
                                                            BCryptPasswordEncoder encoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(encoder);

        return provider;
    }

    @Bean(name = "dataSource")
    public DataSource dataSource() {
        DriverManagerDataSource driverManagerDataSource = new DriverManagerDataSource();
        driverManagerDataSource.setDriverClassName("org.postgresql.Driver");
        driverManagerDataSource.setUrl(jdbcUrl);
        driverManagerDataSource.setUsername(username);
        driverManagerDataSource.setPassword(password);

        return driverManagerDataSource;
    }

    @Bean
    public AuthenticationManager authenticationManager(DaoAuthenticationProvider authenticationProvider) {
        return new ProviderManager(authenticationProvider);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(org.springframework.security.config.annotation.web.builders.HttpSecurity http,
                                                   DaoAuthenticationProvider authenticationProvider,
                                                   JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .authenticationProvider(authenticationProvider)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exceptionHandling -> exceptionHandling.authenticationEntryPoint(
                        (request, response, exception) -> response.sendError(HttpServletResponse.SC_UNAUTHORIZED)))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(POST,
                                         "/oauth/token",
                                         "/organizations/init",
                                         "/organizations/intents",
                                         "/request-password-reset",
                                         "/password-reset").permitAll()
                        .requestMatchers(GET,
                                         "/actuator/health",
                                         "/password-reset",
                                         "/password-reset-token/**",
                                         "/esia/**",
                                         "/users/organizations",
                                         "/specializations/**").permitAll()
                        .requestMatchers(SWAGGER_WHITELIST).permitAll()
                        .anyRequest().authenticated());

        return http.build();
    }

    @Bean
    JwtAuthenticationFilter jwtAuthenticationFilter(@Value("${security.jwt.secret}") String secret) {
        return new JwtAuthenticationFilter(secret, JwtTokenKinds.ACCESS);
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Collections.singletonList("*"));
        configuration.setAllowedMethods(Collections.singletonList("*"));
        configuration.setAllowedHeaders(Collections.singletonList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    @Bean
    IAuthenticationFacade authenticationFacade() {
        return new AuthenticationFacade();
    }
}
