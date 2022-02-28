package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.rest.core.config.Projection;
import ru.mycrg.data_service.entity.File;

import java.time.LocalDateTime;
import java.util.UUID;

@Projection(
        name = "fileProjection",
        types = {File.class})
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public interface FileProjection {

    UUID getId();

    String getTitle();

    Long getSize();

    String getExtension();

    String getIntents();

    ResourceType getResourceType();

    FileResourceQualifier getResourceQualifier();

    String getCreatedBy();

    LocalDateTime getCreatedAt();
}
