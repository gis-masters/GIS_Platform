package ru.mycrg.data_service.service.resources.protectors;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

public interface IResourceProtector {

    void throwIfNotExist(@NotNull ResourceQualifier rIdentifier);

    void throwIfExists(@NotNull ResourceQualifier rIdentifier);

    /**
     * Является ли пользователь владельцем.
     * <p>
     * Считаем что пользователь является владельцем ресурса, если:
     * <li> Пользователь имеет OWNER право.
     * <li> Пользователь является GLOBAL_ADMIN или ORG_ADMIN.
     *
     * @param rQualifier Квалификатор ресурса
     */
    boolean isOwner(ResourceQualifier rQualifier);

    ResourceType getType();
}
