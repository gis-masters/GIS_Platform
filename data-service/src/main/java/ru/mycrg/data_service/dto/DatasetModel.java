package ru.mycrg.data_service.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.hateoas.core.Relation;
import ru.mycrg.data_service.entity.Resource;

@Relation(collectionRelation = "datasets")
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class DatasetModel extends ResourceModel implements IResourceModel {

    public DatasetModel(IResourceModel resourceModel) {
        super(resourceModel);
    }

    public DatasetModel(Resource resource, Roles role) {
        super(resource, role);
    }
}
