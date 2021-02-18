package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.data_service.entity.DocumentLibrary;

import java.time.LocalDateTime;

@Projection(
        name = "documentLibraryProjection",
        types = {DocumentLibrary.class})
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public interface DocumentLibraryProjection {

    Long getId();

    String getTitle();

    String getDetails();

    String getTableName();

    String getSchemaId();

    LocalDateTime getCreatedAt();
}
