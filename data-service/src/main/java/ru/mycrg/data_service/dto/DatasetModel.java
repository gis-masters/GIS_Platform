package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.hateoas.core.Relation;
import ru.mycrg.data_service.entity.SchemasAndTables;

import java.util.Map;

import static ru.mycrg.data_service.dto.ResourceType.DATASET;

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
              null,
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
              dataset.get("schema_id") != null ? String.valueOf(dataset.get("schema_id")) : null,
              dataset.get("created_at") != null ? dataset.get("created_at").toString() : null,
              null);
    }
}
