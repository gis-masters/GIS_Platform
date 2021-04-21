package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.hateoas.core.Relation;
import ru.mycrg.data_service.entity.Resource;

@Relation(collectionRelation = "tables")
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class TableModel extends ResourceModel implements IResourceModel {

    public TableModel(IResourceModel resourceModel) {
        super(resourceModel);
    }

    public TableModel(Resource resource, Roles roles) {
        super(resource, roles);
    }
}
