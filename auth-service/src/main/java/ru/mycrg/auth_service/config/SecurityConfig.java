package ru.mycrg.auth_service.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import ru.mycrg.auth_facade.AuthenticationFacade;
import ru.mycrg.auth_facade.IAuthenticationFacade;

import java.util.Collections;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

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

    @Override
    @Bean
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean(name = "dataSource")
    public DriverManagerDataSource dataSource() {
        DriverManagerDataSource driverManagerDataSource = new DriverManagerDataSource();
        driverManagerDataSource.setDriverClassName("org.postgresql.Driver");
        driverManagerDataSource.setUrl(jdbcUrl);
        driverManagerDataSource.setUsername(username);
        driverManagerDataSource.setPassword(password);

        return driverManagerDataSource;
    }

    @Autowired
    public void configAuthentication(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .jdbcAuthentication()
                .dataSource(dataSource())
                .usersByUsernameQuery("WITH result AS (" +
                                              "    SELECT lower(trim(?)) AS universal_login" +
                                              ")" +
                                              "SELECT login, password, enabled" +
                                              "  FROM users" +
                                              "  WHERE lower(login) IN (SELECT universal_login FROM result)" +
                                              "   OR lower(geoserver_login) IN (SELECT universal_login FROM result)")
                .authoritiesByUsernameQuery("WITH result AS (SELECT lower(trim(?)) AS universal_login)" +
                                                    " SELECT U.login, A.authority" +
                                                    " FROM users AS U" +
                                                    "         INNER JOIN authorities AS A ON U.id = A.user_id" +
                                                    " WHERE lower(U.login) IN (SELECT universal_login FROM result)" +
                                                    "   OR lower(U.geoserver_login) IN (SELECT universal_login FROM result)")
                .passwordEncoder(encoder());
    }

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

    @Bean
    IAuthenticationFacade authenticationFacade() {
        return new AuthenticationFacade();
    }
}
