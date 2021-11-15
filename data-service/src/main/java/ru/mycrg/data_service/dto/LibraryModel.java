package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.hateoas.core.Relation;
import ru.mycrg.data_service.entity.DocumentLibrary;

import java.util.Map;

import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;

@Relation(collectionRelation = "libraries")
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class LibraryModel extends ResourceModel {

    public LibraryModel() {
        super();
    }

    public LibraryModel(Map<String, Object> library) {
        super(Long.valueOf(String.valueOf(library.get("id"))),
              String.valueOf(library.get("title")),
              String.valueOf(library.get("details")),
              LIBRARY.name(),
              String.valueOf(library.get("table_name")),
              null,
              null,
              library.get("schema_id") != null ? String.valueOf(library.get("schema_id")): null,
              library.get("created_at") != null ? library.get("created_at").toString() : null,
              null);
    }

    public LibraryModel(DocumentLibrary dl) {
        super(dl.getId(),
              dl.getTitle(),
              dl.getDetails(),
              LIBRARY.name(),
              dl.getTableName(),
              null,
              null,
              dl.getSchemaId(),
              dl.getCreatedAt() == null ? null : dl.getCreatedAt().toString(),
              null);
    }

    public LibraryModel(DocumentLibrary dl, String role) {
        super(dl.getId(),
              dl.getTitle(),
              dl.getDetails(),
              LIBRARY.name(),
              dl.getTableName(),
              null,
              null,
              dl.getSchemaId(),
              dl.getCreatedAt() == null ? null : dl.getCreatedAt().toString(),
              role);
    }
}
