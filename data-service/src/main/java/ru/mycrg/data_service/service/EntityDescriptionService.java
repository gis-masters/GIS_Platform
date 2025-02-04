package ru.mycrg.data_service.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.entity.EntityDescription;
import ru.mycrg.data_service.repository.EntityDescriptionRepository;
import ru.mycrg.schemas.content_types.EntityContentTypeResponseModel;
import ru.mycrg.schemas.entity.EntityDescriptionResponseModel;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EntityDescriptionService {

    private final EntityDescriptionRepository descriptionRepository;

    public EntityDescriptionService(EntityDescriptionRepository descriptionRepository) {
        this.descriptionRepository = descriptionRepository;
    }

    public List<EntityDescriptionResponseModel> getDescriptions(List<String> tableNames) {
        return descriptionRepository.findAllByTableNameIn(tableNames).stream()
                                    .map(this::mapEntityDescription)
                                    .collect(Collectors.toList());
    }

    @NotNull
    private EntityDescriptionResponseModel mapEntityDescription(EntityDescription entityDescription) {
        EntityDescriptionResponseModel descriptionModel = new EntityDescriptionResponseModel();

        final List<EntityContentTypeResponseModel> contentTypes = entityDescription
                .getContentTypes().stream()
                .map(entityContentType -> new EntityContentTypeResponseModel())
                .collect(Collectors.toList());

        descriptionModel.setContentTypes(contentTypes);

        return descriptionModel;
    }
}
