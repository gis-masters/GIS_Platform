package ru.mycrg.data_service.dto.reestrs;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.data_service.entity.reestrs.Reestr;

import java.time.LocalDateTime;

@Projection(
        name = "reestrProjection",
        types = {Reestr.class})
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public interface ReestrProjection {

    String getTitle();

    String getDescription();

    String getTableName();

    String getCreatedBy();

    LocalDateTime getLastModified();
}
