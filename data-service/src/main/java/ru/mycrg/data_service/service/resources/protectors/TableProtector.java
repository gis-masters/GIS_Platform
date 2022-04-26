package ru.mycrg.data_service.service.resources.protectors;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.dao.ddl.DdlTables;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.security.IAuthenticationFacade;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.Optional;

import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.dto.Roles.CONTRIBUTOR;
import static ru.mycrg.data_service.dto.Roles.OWNER;

@Component
public class TableProtector implements IResourceProtector {

    private final DdlTables ddlTables;
    private final IAuthenticationFacade authenticationFacade;
    private final BasePermissionsRepository basePermissionsRepository;

    public TableProtector(DdlTables ddlTables,
                          IAuthenticationFacade authenticationFacade,
                          BasePermissionsRepository basePermissionsRepository) {
        this.ddlTables = ddlTables;
        this.authenticationFacade = authenticationFacade;
        this.basePermissionsRepository = basePermissionsRepository;
    }

    @Override
    public void throwIfNotExist(@NotNull ResourceQualifier tQualifier) {
        if (!ddlTables.isExist(tQualifier)) {
            throw new NotFoundException(tQualifier.getQualifier());
        }
    }

    @Override
    public void throwIfExists(@NotNull ResourceQualifier tQualifier) {
        if (ddlTables.isExist(tQualifier)) {
            throw new ConflictException("Таблица " + tQualifier + " уже существует");
        }
    }

    @Override
    public boolean isOwner(ResourceQualifier tQualifier) {
        return authenticationFacade.isOrganizationAdmin()
                || isUserHasOwnPermission(tQualifier)
                || authenticationFacade.isRoot();
    }

    @Override
    public boolean isAllowed(ResourceQualifier tQualifier) {
        return authenticationFacade.isOrganizationAdmin()
                || authenticationFacade.isRoot()
                || basePermissionsRepository.bestRoleForTable(tQualifier)
                                            .isPresent();
    }

    @Override
    public boolean isEditAllowed(ResourceQualifier qualifier) {
        return authenticationFacade.isOrganizationAdmin()
                || isUserHasEditPermission(qualifier)
                || authenticationFacade.isRoot();
    }

    @Override
    public ResourceType getType() {
        return TABLE;
    }

    /**
     * Для таблицы проверим наследования сверху от набора(права выданные на набор) и права на саму таблицу
     */
    private boolean isUserHasOwnPermission(ResourceQualifier tQualifier) {
        Optional<String> oRole = basePermissionsRepository.bestRoleForTable(tQualifier);
        if (oRole.isEmpty()) {
            return false;
        }

        return OWNER.name().equals(oRole.get());
    }

    private boolean isUserHasEditPermission(ResourceQualifier tQualifier) {
        Optional<String> oRole = basePermissionsRepository.bestRoleForTable(tQualifier);
        if (oRole.isEmpty()) {
            return false;
        }

        return CONTRIBUTOR.name().equals(oRole.get()) || OWNER.name().equals(oRole.get());
    }
}
