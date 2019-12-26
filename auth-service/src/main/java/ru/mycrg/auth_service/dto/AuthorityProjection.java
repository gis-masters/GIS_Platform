package ru.mycrg.auth_service.dto;

import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.auth_service.entity.Authorities;

@Projection(
        name = "commonAuthorities",
        types = { Authorities.class })
public interface AuthorityProjection {

    String getAuthority();
}
