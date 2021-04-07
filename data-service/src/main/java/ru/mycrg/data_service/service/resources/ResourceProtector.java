package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import ru.mycrg.common_utils.security.RoleHierarchy;
import ru.mycrg.data_service.dto.Roles;
import ru.mycrg.data_service.entity.Permission;
import ru.mycrg.data_service.entity.Resource;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.security.IAuthenticationFacade;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.dto.Roles.OWNER;

@Service
public class ResourceProtector {

    private final RoleHierarchy roleHierarchy;
    private final ResourceManagerFactory resourceManagerFactory;
    private final IAuthenticationFacade authenticationFacade;

    public ResourceProtector(ResourceManagerFactory resourceManagerFactory,
                             RoleHierarchy roleHierarchy,
                             IAuthenticationFacade authenticationFacade) {
        this.resourceManagerFactory = resourceManagerFactory;
        this.authenticationFacade = authenticationFacade;
        this.roleHierarchy = roleHierarchy;
    }

    public void throwIfNotExist(@NotNull ResourceIdentifier rIdentifier) {
        if (!resourceManagerFactory.get(rIdentifier).isExist(rIdentifier)) {
            throw new NotFoundException(rIdentifier.toString());
        }
    }

    public void throwIfExists(@NotNull ResourceIdentifier rIdentifier) {
        if (resourceManagerFactory.get(rIdentifier).isExist(rIdentifier)) {
            throw new ConflictException("The resource " + rIdentifier + " already exist");
        }
    }

    /**
     * Определяет роль пользователя для заданного ресурса.
     * <p>
     * Пользователи с ролями GLOBAL_ADMIN или ORG_ADMIN безусловно определяются как: OWNER
     * <p>
     * В случае если для пользователя заданы несколько правил будет выбрана "лучшая/сильнейшая" из ролей.
     * <p>
     * Пример 1. Непосредственно пользователю задана роль: CONTRIBUTOR, а группе в которой он состоит задана роль:
     * VIEWER. Будет выбрана роль: CONTRIBUTOR.
     * <p>
     * Пример 2. Напрямую пользователю прав не задано, но он состоит в двух группах, одной из них выставлены права на
     * чтение: VIEWER, другая - группа владельцев: OWNER. Будет выбрана роль: OWNER.
     *
     * @param resource    Ресурс
     * @param permissions все разрешения на ресурс для текущего пользователя
     *
     * @return Определяет роль пользователя для заданного ресурса если таковая может быть определена или пустой {@link
     * Optional} объект.
     */
    public Optional<Roles> defineRole(Resource resource, Set<Permission> permissions) {
        if (isAbsoluteOwner(resource)) {
            return Optional.of(OWNER);
        }

        final List<String> allRoles = permissions.stream()
                                                 .map(Permission::getRole)
                                                 .collect(Collectors.toList());

        return roleHierarchy.defineBest(allRoles)
                            .map(Roles::valueOf);
    }

    /**
     * Возвращает {@code true} если ресурс доступен пользователю на чтение.
     * <p>
     * Ресурс доступен если:
     * <li> пользователь является его владельцем.
     * <li> пользователь является GLOBAL_ADMIN или ORG_ADMIN.
     * <li> для пользователя заданы разрешения {@link Roles} любого уровня доступа.
     *
     * @param resource    Ресурс
     * @param permissions все разрешения на ресурс для текущего пользователя
     *
     * @return Возвращает {@code true} если ресурс доступен пользователю на чтение.
     */
    public boolean isReadAllowed(Resource resource, Set<Permission> permissions) {
        return isAbsoluteOwner(resource)
                || !permissions.isEmpty();
    }

    /**
     * Возвращает {@code true} если создание разрешений доступно пользователю.
     * <p>
     * Создание разрешений доступно для:
     * <li> Владельца ресурса.
     * <li> Пользователей являющихся GLOBAL_ADMIN или ORG_ADMIN.
     * <li> Пользователей с ролью {@code OWNER}.
     *
     * @param resource    Ресурс.
     * @param permissions все разрешения на ресурс для текущего пользователя
     *
     * @return Возвращает {@code true} если создание разрешений доступно пользователю.
     */
    public boolean isCreatePermissionAllowed(Resource resource, Set<Permission> permissions) {
        if (isAbsoluteOwner(resource)) {
            return true;
        }

        final List<String> allRoles = permissions.stream()
                                                 .map(Permission::getRole)
                                                 .collect(Collectors.toList());

        return roleHierarchy.defineBest(allRoles)
                            .map(bestRole -> bestRole.equals(OWNER.name()))
                            .orElse(false);
    }

    /**
     * Считаем что пользователь является абсолютным владельцем ресурса, если:
     * <li> Пользователь является владельцем ресурса.
     * <li> Пользователей является GLOBAL_ADMIN или ORG_ADMIN.
     *
     * @param resource Ресурс
     */
    public boolean isAbsoluteOwner(Resource resource) {
        return resource.isUserOwnMe(authenticationFacade.getLogin())
                || authenticationFacade.isOrganizationAdmin()
                || authenticationFacade.isRoot();
    }
}
