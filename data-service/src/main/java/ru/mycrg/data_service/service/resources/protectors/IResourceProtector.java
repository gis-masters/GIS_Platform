package ru.mycrg.data_service.service.resources.protectors;

import ru.mycrg.data_service.dto.ResourceType;

public interface IResourceProtector extends IMasterResourceProtector {

    ResourceType getType();
}
