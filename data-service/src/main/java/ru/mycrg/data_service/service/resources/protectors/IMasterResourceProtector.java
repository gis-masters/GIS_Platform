package ru.mycrg.data_service.service.resources.protectors;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

public interface IMasterResourceProtector {

    /**
     * @param qualifier Квалификатор ресурса
     *
     * @throws NotFoundException если ресурс не существует.
     */
    void throwIfNotExist(@NotNull ResourceQualifier qualifier);

    /**
     * @param qualifier Квалификатор ресурса
     *
     * @throws ConflictException если такой ресурс уже существует.
     */
    void throwIfExists(@NotNull ResourceQualifier qualifier);

    /**
     * Является ли пользователь владельцем.
     * <br>
     * Считаем что пользователь является владельцем ресурса, если:
     * <li> Пользователь имеет OWNER право.
     * <li> Пользователь является SYSTEM_ADMIN или ORG_ADMIN.
     *
     * @param qualifier Квалификатор ресурса
     */
    boolean isOwner(ResourceQualifier qualifier);

    /**
     * Проверка доступности ресурса пользователю.
     *
     * @param qualifier Квалификатор ресурса
     */
    boolean isAllowed(ResourceQualifier qualifier);

    /**
     * Проверка доступности ресурса пользователю, на редактирование.
     *
     * @param qualifier Квалификатор ресурса
     */
    boolean isEditAllowed(ResourceQualifier qualifier);
}
