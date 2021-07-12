package ru.mycrg.data_service.service.resources;

import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.security.IAuthenticationFacade;

import java.util.Objects;
import java.util.Optional;

import static ru.mycrg.data_service.dto.Roles.OWNER;

@Service
public class ResourceProtector {

    private final IAuthenticationFacade authenticationFacade;
    private final ResourceManagerFactory resourceManagerFactory;
    private final BasePermissionsRepository basePermissionsRepository;

    public ResourceProtector(ResourceManagerFactory resourceManagerFactory,
                             IAuthenticationFacade authenticationFacade,
                             BasePermissionsRepository basePermissionsRepository) {
        this.resourceManagerFactory = resourceManagerFactory;
        this.authenticationFacade = authenticationFacade;
        this.basePermissionsRepository = basePermissionsRepository;
    }

    public void throwIfNotExist(@NotNull ResourceQualifier rIdentifier) {
        if (!resourceManagerFactory.get(rIdentifier).isExist(rIdentifier)) {
            throw new NotFoundException(rIdentifier.getQualifier());
        }
    }

    public void throwIfExists(@NotNull ResourceQualifier rIdentifier) {
        if (resourceManagerFactory.get(rIdentifier).isExist(rIdentifier)) {
            throw new ConflictException("The resource " + rIdentifier + " already exist");
        }
    }

    /**
     * Считаем что пользователь является владельцем ресурса, если:
     * <li> Пользователь имеет OWNER право.
     * <li> Пользователей является GLOBAL_ADMIN или ORG_ADMIN.
     *
     * @param rQualifier Ресурс
     */
    public boolean isOwner(ResourceQualifier rQualifier) {
        return authenticationFacade.isOrganizationAdmin()
                || isUserHasOwnPermission(rQualifier)
                || authenticationFacade.isRoot();
    }

    private boolean isUserHasOwnPermission(ResourceQualifier rQualifier) {
        Optional<String> oRole = basePermissionsRepository.bestRole(rQualifier, "/root");
        if (oRole.isEmpty()) {
            return false;
        }

        return Objects.equals(OWNER.name(), oRole.get());
    }
}
