package ru.mycrg.data_service.service.resources.protectors;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.common_contracts.enums.Roles;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.document_library.DocumentLibraryService;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

import java.util.Optional;

import static ru.mycrg.common_contracts.enums.Roles.CONTRIBUTOR;
import static ru.mycrg.common_contracts.enums.Roles.OWNER;
import static ru.mycrg.data_service.dto.ResourceType.LIBRARY;

@Component
public class DocLibraryProtector implements IResourceProtector {

    private final IAuthenticationFacade authenticationFacade;
    private final DocumentLibraryService documentLibraryService;
    private final BasePermissionsRepository basePermissionsRepository;

    public DocLibraryProtector(IAuthenticationFacade authenticationFacade,
                               DocumentLibraryService documentLibraryService,
                               BasePermissionsRepository basePermissionsRepository) {
        this.authenticationFacade = authenticationFacade;
        this.documentLibraryService = documentLibraryService;
        this.basePermissionsRepository = basePermissionsRepository;
    }

    @Override
    public void throwIfNotExist(@NotNull ResourceQualifier dlQualifier) {
        if (!documentLibraryService.isExist(dlQualifier)) {
            throw new NotFoundException(dlQualifier.getQualifier());
        }
    }

    @Override
    public void throwIfExists(@NotNull ResourceQualifier dlQualifier) {
        if (documentLibraryService.isExist(dlQualifier)) {
            throw new ConflictException("Библиотека " + dlQualifier + " уже существует");
        }
    }

    @Override
    public boolean isOwner(ResourceQualifier dlQualifier) {
        return authenticationFacade.isOrganizationAdmin()
                || isUserHasOwnPermission(dlQualifier)
                || authenticationFacade.isRoot();
    }

    @Override
    public boolean isAllowed(ResourceQualifier dlQualifier) {
        return authenticationFacade.isOrganizationAdmin()
                || authenticationFacade.isRoot()
                || basePermissionsRepository.getBestRoleForLibrary(dlQualifier.getTable())
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
        return LIBRARY;
    }

    /**
     * Для библиотек только непосредственные права на таблицу
     */
    private boolean isUserHasOwnPermission(ResourceQualifier dlQualifier) {
        Optional<Roles> oRole = basePermissionsRepository.getBestRoleForLibrary(dlQualifier.getTable());

        return oRole.filter(roles -> OWNER == roles).isPresent();
    }

    private boolean isUserHasEditPermission(ResourceQualifier dlQualifier) {
        Optional<Roles> oRole = basePermissionsRepository.getBestRoleForLibrary(dlQualifier.getTable());

        return oRole.filter(roles -> CONTRIBUTOR == roles || OWNER == roles).isPresent();
    }
}
