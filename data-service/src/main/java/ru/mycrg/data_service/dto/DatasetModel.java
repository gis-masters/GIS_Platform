package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.hateoas.core.Relation;
import ru.mycrg.data_service.entity.SchemasAndTables;

import java.util.Map;

import static ru.mycrg.data_service.dto.ResourceType.DATASET;
import static ru.mycrg.data_service.mappers.SchemaMapper.jsonToDto;

@Relation(collectionRelation = "datasets")
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class DatasetModel extends ResourceModel implements IResourceModel {

    public DatasetModel() {
        super();
    }

    public DatasetModel(SchemasAndTables resource, String role, Integer itemCount) {
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

    public DatasetModel(Map<String, Object> dataset) {
        super(Long.valueOf(String.valueOf(dataset.get("id"))),
              String.valueOf(dataset.get("title")),
              dataset.get("details") != null ? dataset.get("details").toString() : null,
              DATASET.name(),
              String.valueOf(dataset.get("identifier")),
              dataset.get("items_count") != null ? Integer.parseInt(String.valueOf(dataset.get("items_count"))) : 0,
              dataset.get("crs") != null ? String.valueOf(dataset.get("crs")) : null,
              dataset.get("schema") != null ? jsonToDto((JsonNode) dataset.get("schema")) : null,
              dataset.get("created_at") != null ? dataset.get("created_at").toString() : null,
              null);
    }
}
