package ru.mycrg.data_service.service.resources.protectors;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

@Component
public class DefaultProtector implements IResourceProtector {

    @Override
    public void throwIfNotExist(@NotNull ResourceQualifier qualifier) {
        throw new DataServiceException("Не найден обработчик для ресурса: " + qualifier.getType());
    }

    @Override
    public void throwIfExists(@NotNull ResourceQualifier qualifier) {
        throw new DataServiceException("Не найден обработчик для ресурса: " + qualifier.getType());
    }

    @Override
    public boolean isOwner(ResourceQualifier fQualifier) {
        return false;
    }

    @Override
    public boolean isAllowed(ResourceQualifier fQualifier) {
        return false;
    }

    @Override
    public boolean isEditAllowed(ResourceQualifier qualifier) {
        return false;
    }

    @Override
    public ResourceType getType() {
        return null;
    }
}
