package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.hateoas.core.Relation;
import ru.mycrg.common_contracts.enums.Roles;
import ru.mycrg.data_service.entity.SchemasAndTables;

import static ru.mycrg.data_service.dto.ResourceType.DATASET;
import static ru.mycrg.data_service.mappers.SchemaMapper.jsonToDto;

@Relation(collectionRelation = "datasets")
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class DatasetModel extends ResourceModel implements IResourceModel {

    public DatasetModel() {
        super();
    }

    public DatasetModel(SchemasAndTables resource, Roles role, Integer itemCount) {
        super(resource.getId(),
              resource.getTitle(),
              resource.getDetails(),
              DATASET.name(),
              resource.getIdentifier(),
              itemCount,
              null,
              jsonToDto(resource.getSchema()),
              resource.getCreatedAt().toString(),
              role);
    }
}
