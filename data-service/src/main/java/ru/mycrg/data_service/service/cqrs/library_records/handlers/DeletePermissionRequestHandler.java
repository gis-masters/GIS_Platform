package ru.mycrg.data_service.service.cqrs.library_records.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.repository.PermissionRepository;
import ru.mycrg.data_service.service.cqrs.library_records.requests.DeletePermissionRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IMasterResourceProtector;
import ru.mycrg.data_service.service.resources.protectors.MasterResourceProtector;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

@Component
public class DeletePermissionRequestHandler implements IRequestHandler<DeletePermissionRequest, Voidy> {

    private final PermissionRepository permissionRepository;
    private final IMasterResourceProtector resourceProtector;

    public DeletePermissionRequestHandler(PermissionRepository permissionRepository,
                                          MasterResourceProtector resourceProtector) {
        this.permissionRepository = permissionRepository;
        this.resourceProtector = resourceProtector;
    }

    @Override
    public Voidy handle(DeletePermissionRequest request) {
        ResourceQualifier resourceQualifier = request.getrQualifier();
        Long permissionId = request.getPermissionId();

        if (!resourceProtector.isOwner(resourceQualifier)) {
            throw new ForbiddenException("Недостаточно прав для удаления разрешения: " + permissionId);
        }

        permissionRepository.deleteById(permissionId);

        return new Voidy();
    }
}
