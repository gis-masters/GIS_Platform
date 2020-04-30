package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.data_service.entity.Resource;

@Projection(
        name = "resourceProjection",
        types = { Resource.class })
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public interface ResourceProjection {

    String getType();

    String getIdentifier();

}
