package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.hateoas.core.Relation;
import ru.mycrg.data_service.entity.SchemasAndTables;

import java.util.Map;

import static ru.mycrg.data_service.dto.ResourceType.TABLE;

@Relation(collectionRelation = "tables")
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class TableModel extends ResourceModel implements IResourceModel {

    public TableModel() {
        super();
    }

    public TableModel(SchemasAndTables table) {
        this(table.getId(), table.getTitle(), table.getDetails(), TABLE.name(), table.getIdentifier(),
             table.getItemsCount(), table.getCrs(), table.getSchemaId(), table.getCreatedAt().toString(), null);
    }

    public TableModel(Map<String, Object> table) {
        this(Long.valueOf(String.valueOf(table.get("id"))),
             String.valueOf(table.get("title")),
             String.valueOf(table.get("details")),
             TABLE.name(),
             String.valueOf(table.get("identifier")),
             Integer.valueOf(String.valueOf(table.get("items_count"))),
             String.valueOf(table.get("crs")),
             String.valueOf(table.get("schema_id")),
             table.get("created_at").toString(),
             null);
    }

    public TableModel(SchemasAndTables table, String role) {
        this(table.getId(), table.getTitle(), table.getDetails(), TABLE.name(), table.getIdentifier(),
             table.getItemsCount(), table.getCrs(), table.getSchemaId(), table.getCreatedAt().toString(), role);
    }

    public TableModel(Long id, String title, String details, String type, String identifier, Integer itemsCount,
                      String crs, String schemaId, String createdAt, String role) {
        super(id, title, details, type, identifier, itemsCount, crs, schemaId, createdAt, role);
    }
}
