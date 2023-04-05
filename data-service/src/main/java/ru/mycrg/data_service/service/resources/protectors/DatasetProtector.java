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

import static ru.mycrg.data_service.dto.ResourceType.DATASET;
import static ru.mycrg.data_service.dto.Roles.CONTRIBUTOR;
import static ru.mycrg.data_service.dto.Roles.OWNER;

@Component
public class DatasetProtector implements IResourceProtector {

    private final IAuthenticationFacade authenticationFacade;
    private final BasePermissionsRepository basePermissionsRepository;
    private final SchemasAndTablesRepository schemasAndTablesRepository;

    public DatasetProtector(IAuthenticationFacade authenticationFacade,
                            BasePermissionsRepository basePermissionsRepository,
                            SchemasAndTablesRepository schemasAndTablesRepository) {
        this.authenticationFacade = authenticationFacade;
        this.basePermissionsRepository = basePermissionsRepository;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
    }

    @Override
    public void throwIfNotExist(@NotNull ResourceQualifier dQualifier) {
        Optional<SchemasAndTables> dataset = schemasAndTablesRepository.findByIdentifier(dQualifier.toString());

        if (dataset.isEmpty()) {
            throw new NotFoundException(dQualifier.getQualifier());
        }
    }

    @Override
    public void throwIfExists(@NotNull ResourceQualifier dQualifier) {
        Optional<SchemasAndTables> dataset = schemasAndTablesRepository.findByIdentifier(dQualifier.toString());

        if (dataset.isPresent()) {
            throw new ConflictException("Набор данных " + dQualifier + " уже существует");
        }
    }

    @Override
    public boolean isOwner(ResourceQualifier dQualifier) {
        return authenticationFacade.isOrganizationAdmin()
                || isUserHasOwnPermission(dQualifier)
                || authenticationFacade.isRoot();
    }

    @Override
    public boolean isAllowed(ResourceQualifier dQualifier) {
        return authenticationFacade.isOrganizationAdmin()
                || authenticationFacade.isRoot()
                || basePermissionsRepository.getBestRoleForDataset(dQualifier)
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
        return DATASET;
    }

    /**
     * Для набора данных не бывает наследования сверху, поэтому проверим только права выданные на сам набор.
     */
    private boolean isUserHasOwnPermission(ResourceQualifier dQualifier) {
        Optional<String> oRole = basePermissionsRepository.getBestRoleForDataset(dQualifier);
        if (oRole.isEmpty()) {
            return false;
        }

        return OWNER.name().equals(oRole.get());
    }

    private boolean isUserHasEditPermission(ResourceQualifier dQualifier) {
        Optional<String> oRole = basePermissionsRepository.getBestRoleForDataset(dQualifier);
        if (oRole.isEmpty()) {
            return false;
        }

        return CONTRIBUTOR.name().equals(oRole.get()) || OWNER.name().equals(oRole.get());
    }
}
