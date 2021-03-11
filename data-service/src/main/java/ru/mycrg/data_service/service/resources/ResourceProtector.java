package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dto.Roles;
import ru.mycrg.data_service.entity.Permission;
import ru.mycrg.data_service.entity.Resource;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.security.UserDetails;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.security.CrgClaimsParser.*;

@Service
public class ResourceProtector {

    private final ResourceManagerFactory resourceManagerFactory;

    public ResourceProtector(ResourceManagerFactory resourceManagerFactory) {
        this.resourceManagerFactory = resourceManagerFactory;
    }

    public void throwIfNotExist(@NotNull ResourceIdentifier rIdentifier) {
        if (!resourceManagerFactory.get(rIdentifier).isExist(rIdentifier)) {
            throw new NotFoundException(rIdentifier.toString());
        }
    }

    public void throwIfExists(@NotNull ResourceIdentifier rIdentifier) {
        if (resourceManagerFactory.get(rIdentifier).isExist(rIdentifier)) {
            throw new ConflictException("The resource " + rIdentifier.toString() + " already exist");
        }
    }

    /**
     * Возвращает {@code true} если ресурс доступен пользователю.
     * <p>
     * Считаем что ресурс доступен пользователю если он его владелец или имеет роли GLOBAL_ADMIN или ORG_ADMIN.
     *
     * @param resource       Ресурс.
     * @param authentication Интерфейс описывающий пользователя.
     *
     * @return Возвращает {@code true} если ресурс доступен пользователю.
     */
    public boolean isAllowed(@NotNull Resource resource, Authentication authentication) {
        if (isOrganizationAdmin(authentication) || isRoot(authentication)) {
            return true;
        }

        if (resource.getCreatedBy().equals(authentication.getName())) {
            return true;
        }

        List<Long> allUsersIds = getUsersId(authentication);
        // Для понимания того что ресурс доступен пользователю достаточно найти любое правило с id из списка
        for (Permission permission: resource.getPermissions()) {
            if (allUsersIds.contains(permission.getPrincipal().getIdentifier())) {
                return true;
            }
        }

        return false;
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
     * чтение: VIEWER, другая - группа владельцов: OWNER. Будет выбрана ролья: OWNER.
     *
     * @param resource       Ресурс.
     * @param authentication Интерфейс описывающий пользователя.
     *
     * @return Определяет роль пользователя для заданного ресурса если таковая может быть определена или пустой {@link
     * Optional} обьект.
     */
    public Optional<Roles> defineRole(Resource resource, Authentication authentication) {
        if (isOrganizationAdmin(authentication) ||
                resource.getCreatedBy().equals(authentication.getName()) ||
                isRoot(authentication)) {
            return Optional.of(Roles.OWNER);
        }

        Roles bestRole = null;
        List<Long> allUsersIds = getUsersId(authentication);
        final List<Roles> allRoles = resource
                .getPermissions().stream()
                .filter(permission -> allUsersIds.contains(permission.getPrincipal().getIdentifier()))
                .map(permission -> Roles.valueOf(permission.getRole()))
                .collect(Collectors.toList());

        if (allRoles.contains(Roles.OWNER)) {
            bestRole = Roles.OWNER;
        } else if (allRoles.contains(Roles.CONTRIBUTOR)) {
            bestRole = Roles.CONTRIBUTOR;
        } else if (allRoles.contains(Roles.VIEWER)) {
            bestRole = Roles.VIEWER;
        }

        return bestRole == null ? Optional.empty() : Optional.of(bestRole);
    }

    /**
     * Список всех идентификаторов, связанных с пользователем.
     * <p>
     * Кроме непосредственно своего id, к пользователю имеют отношения так же идентификаторы групп в которые входит
     * пользователь. А для оценки роли пользователя удобно иметь все идентификаторы одним списком. И это будет удобно до
     * тех пор пока права выданные непосредственно пользователю равновесны с правами которые пользователь получает от
     * групп в которых состоит.
     *
     * @param authentication Интерфейс описывающий пользователя.
     *
     * @return Список всех идентификаторов, связанных с пользователем.
     */
    @NotNull
    private List<Long> getUsersId(Authentication authentication) {
        UserDetails userDetails = getUserDetails(authentication);
        List<Long> allUsersIds = userDetails.getGroups();
        allUsersIds.add(userDetails.getUserId());

        return allUsersIds;
    }
}
