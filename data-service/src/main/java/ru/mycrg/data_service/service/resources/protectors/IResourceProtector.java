package ru.mycrg.data_service.service.resources.protectors;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

public interface IResourceProtector {

    /**
     * @param rQualifier Квалификатор ресурса
     *
     * @throws NotFoundException если ресурс не существует.
     */
    void throwIfNotExist(@NotNull ResourceQualifier rQualifier);

    /**
     * @param rQualifier Квалификатор ресурса
     *
     * @throws ConflictException если такой ресурс уже существует.
     */
    void throwIfExists(@NotNull ResourceQualifier rQualifier);

    /**
     * Является ли пользователь владельцем.
     * <br>
     * Считаем что пользователь является владельцем ресурса, если:
     * <li> Пользователь имеет OWNER право.
     * <li> Пользователь является GLOBAL_ADMIN или ORG_ADMIN.
     *
     * @param rQualifier Квалификатор ресурса
     */
    boolean isOwner(ResourceQualifier rQualifier);

    /**
     * Проверка доступности ресурса пользователю.
     *
     * @param rQualifier Квалификатор ресурса
     */
    boolean isAllowed(ResourceQualifier rQualifier);

    ResourceType getType();
}
