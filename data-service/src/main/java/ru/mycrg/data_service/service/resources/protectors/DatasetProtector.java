package ru.mycrg.data_service.service.resources.protectors;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.dao.ddl.DdlSchemas;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.security.IAuthenticationFacade;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.Objects;
import java.util.Optional;

import static ru.mycrg.data_service.dto.ResourceType.DATASET;
import static ru.mycrg.data_service.dto.Roles.OWNER;

@Component
public class DatasetProtector implements IResourceProtector {

    private final DdlSchemas ddlSchemas;
    private final IAuthenticationFacade authenticationFacade;
    private final BasePermissionsRepository basePermissionsRepository;

    public DatasetProtector(DdlSchemas ddlSchemas,
                            IAuthenticationFacade authenticationFacade,
                            BasePermissionsRepository basePermissionsRepository) {
        this.ddlSchemas = ddlSchemas;
        this.authenticationFacade = authenticationFacade;
        this.basePermissionsRepository = basePermissionsRepository;
    }

    @Override
    public void throwIfNotExist(@NotNull ResourceQualifier dQualifier) {
        if (!ddlSchemas.isExist(dQualifier)) {
            throw new NotFoundException(dQualifier.getQualifier());
        }
    }

    @Override
    public void throwIfExists(@NotNull ResourceQualifier dQualifier) {
        if (ddlSchemas.isExist(dQualifier)) {
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
                || basePermissionsRepository.getRoleForDataset(dQualifier)
                                            .isPresent();
    }

    @Override
    public ResourceType getType() {
        return DATASET;
    }

    /**
     * Для набора данных не бывает наследования сверху, поэтому проверим только права выданные на сам набор.
     */
    private boolean isUserHasOwnPermission(ResourceQualifier dQualifier) {
        Optional<String> oRole = basePermissionsRepository.getRoleForDataset(dQualifier);
        if (oRole.isEmpty()) {
            return false;
        }

        return Objects.equals(OWNER.name(), oRole.get());
    }
}
