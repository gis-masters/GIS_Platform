package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.hateoas.core.Relation;
import ru.mycrg.data_service.entity.ResourceDescription;

@Relation(collectionRelation = "datasets")
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class DatasetModel extends BaseModel {

    public DatasetModel() {
        super();
    }

    public DatasetModel(String name, Roles role) {
        super(name, role.name());
    }

    public DatasetModel(ResourceDescription rd, Roles role) {
        super(rd.getTitle(), rd.getDetails(), rd.getType(), rd.getIdentifier(), rd.getItemsCount(), role.name(),
              rd.getCreatedAt());
    }
}
