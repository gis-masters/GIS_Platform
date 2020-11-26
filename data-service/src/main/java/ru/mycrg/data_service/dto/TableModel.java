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

    public TableModel(String id) {
        super(id);
    }

    public TableModel(String name, Roles role) {
        super(name, role.name());
    }

    public TableModel(ResourceDescription rd, Roles role) {
        super(rd.getTitle(), rd.getDetails(), rd.getType(), rd.getIdentifier(), rd.getItemsCount(), role.name(),
              rd.getCreatedAt());
    }
}
