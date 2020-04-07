package ru.mycrg.auth_service.dto;

import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.auth_service.entity.User;

@Projection(
        name = "onlyIdUser",
        types = { User.class })
public interface UserOnlyIdProjection {

    Long getId();

}
