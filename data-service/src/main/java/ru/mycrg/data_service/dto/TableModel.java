package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.hateoas.core.Relation;
import ru.mycrg.data_service.entity.ResourceDescription;

@Relation(collectionRelation = "tables")
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class TableModel extends BaseModel {

    public TableModel() {
        super();
    }

    public TableModel(String tableName) {
        super(tableName);
    }

    public TableModel(String name, String permission) {
        super(name, permission);
    }

    public TableModel(ResourceDescription rd, String permission) {
        super(rd.getTitle(), rd.getDetails(), rd.getType(), rd.getResourceIdentifier(), rd.getCreatedAt(), permission);
    }
}
