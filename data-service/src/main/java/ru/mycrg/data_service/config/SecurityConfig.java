package ru.mycrg.data_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.mycrg.common_utils.security.DefaultRoleHierarchy;
import ru.mycrg.common_utils.security.RoleHierarchy;

import static ru.mycrg.data_service.dto.Roles.*;

@Configuration
public class SecurityConfig {

    @Bean
    public RoleHierarchy roleHierarchy() {
        return new DefaultRoleHierarchy(new String[]{OWNER.name(), CONTRIBUTOR.name(), VIEWER.name()});
    }
}
