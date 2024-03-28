package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import ru.mycrg.data_service.entity.DocumentLibrary;

import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;
import static ru.mycrg.data_service.mappers.SchemaMapper.jsonToDto;

@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class LibraryModel extends ResourceModel {

    @JsonProperty("table_name")
    private String tableName;

    @JsonProperty("versioned")
    private Boolean versioned;

    @JsonProperty("readyForFts")
    private Boolean readyForFts;

    public LibraryModel() {
        super();
    }

    public LibraryModel(DocumentLibrary dl) {
        super(dl.getId(),
              dl.getTitle(),
              dl.getDetails(),
              LIBRARY.name(),
              null,
              null,
              null,
              jsonToDto(dl.getSchema()),
              dl.getCreatedAt() == null ? null : dl.getCreatedAt().toString(),
              null);

        this.tableName = dl.getTableName();
        this.versioned = dl.isVersioned();
        this.readyForFts = dl.getReadyForFts();
    }

    public LibraryModel(DocumentLibrary dl, String role) {
        super(dl.getId(),
              dl.getTitle(),
              dl.getDetails(),
              LIBRARY.name(),
              null,
              null,
              null,
              jsonToDto(dl.getSchema()),
              dl.getCreatedAt() == null ? null : dl.getCreatedAt().toString(),
              role);

        this.tableName = dl.getTableName();
        this.versioned = dl.isVersioned();
        this.readyForFts = dl.getReadyForFts();
    }

    public String getTableName() {
        return tableName;
    }

    public Boolean getVersioned() {
        return versioned;
    }

    public Boolean getReadyForFts() {
        return readyForFts;
    }
}
