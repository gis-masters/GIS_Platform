package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import ru.mycrg.data_service.entity.DocumentLibrary;

import java.util.Map;

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

    public LibraryModel(Map<String, Object> library) {
        super(Long.valueOf(String.valueOf(library.get("id"))),
              String.valueOf(library.get("title")),
              String.valueOf(library.get("details")),
              LIBRARY.name(),
              null,
              null,
              null,
              library.get("schema") != null ? jsonToDto((String) library.get("schema")) : null,
              library.get("created_at") != null ? library.get("created_at").toString() : null,
              null);

        this.tableName = String.valueOf(library.get("table_name"));
        this.versioned = Boolean.parseBoolean(String.valueOf(library.get("versioned")));
        this.readyForFts = Boolean.parseBoolean(String.valueOf(library.get("readyForFts")));
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
