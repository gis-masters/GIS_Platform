package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.hateoas.core.Relation;
import ru.mycrg.data_service.entity.DocumentLibrary;

import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;

@Relation(collectionRelation = "libraries")
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class LibraryModel extends ResourceModel {

    public LibraryModel() {
        super();
    }

    public LibraryModel(DocumentLibrary library, Roles role) {
        super(library.getTitle(), library.getDetails(), LIBRARY.name(), library.getTableName(),
              library.getSchemaId(), role.name(), library.getCreatedAt());
    }
}
