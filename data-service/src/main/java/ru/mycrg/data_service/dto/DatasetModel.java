package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.hateoas.core.Relation;
import ru.mycrg.data_service.entity.Resource;

@Relation(collectionRelation = "datasets")
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class DatasetModel extends ResourceModel {

    public DatasetModel() {
        super();
    }

    public DatasetModel(Resource resource, Roles roles) {
        super(resource, roles);
    }
}
