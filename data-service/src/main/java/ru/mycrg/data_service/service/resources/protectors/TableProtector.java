package ru.mycrg.data_service.service.resources.protectors;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.Optional;

import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.dto.Roles.CONTRIBUTOR;
import static ru.mycrg.data_service.dto.Roles.OWNER;

@Component
public class TableProtector implements IResourceProtector {

    private final IAuthenticationFacade authenticationFacade;
    private final BasePermissionsRepository basePermissionsRepository;
    private final SchemasAndTablesRepository schemasAndTablesRepository;

    public TableProtector(IAuthenticationFacade authenticationFacade,
                          BasePermissionsRepository basePermissionsRepository,
                          SchemasAndTablesRepository schemasAndTablesRepository) {
        this.authenticationFacade = authenticationFacade;
        this.basePermissionsRepository = basePermissionsRepository;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
    }

    @Override
    public void throwIfNotExist(@NotNull ResourceQualifier tQualifier) {
        Optional<SchemasAndTables> table = schemasAndTablesRepository.findByIdentifier(tQualifier.toString());

        if (table.isEmpty()) {
            throw new NotFoundException(tQualifier.getQualifier());
        }
    }

    @Override
    public void throwIfExists(@NotNull ResourceQualifier tQualifier) {
        Optional<SchemasAndTables> table = schemasAndTablesRepository.findByIdentifier(tQualifier.toString());

        if (table.isPresent()) {
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
