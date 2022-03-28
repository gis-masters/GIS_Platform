package ru.mycrg.data_service.service.cqrs.library_records.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dto.ResourceType;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.repository.PermissionRepository;
import ru.mycrg.data_service.service.cqrs.library_records.requests.DeletePermissionRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IResourceProtector;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.List;
import java.util.Map;
import java.util.function.Function;

import static java.util.stream.Collectors.toMap;

@Component
public class DeletePermissionRequestHandler implements IRequestHandler<DeletePermissionRequest, Voidy> {

    private final PermissionRepository permissionRepository;
    private final Map<ResourceType, IResourceProtector> protectors;

    public DeletePermissionRequestHandler(PermissionRepository permissionRepository,
                                          List<IResourceProtector> protectors) {
        this.permissionRepository = permissionRepository;

        this.protectors = protectors.stream()
                                    .collect(toMap(IResourceProtector::getType, Function.identity()));
    }

    @Override
    public Voidy handle(DeletePermissionRequest request) {
        ResourceQualifier resourceQualifier = request.getrQualifier();
        Long permissionId = request.getPermissionId();

        if (!protectors.get(resourceQualifier.getType()).isOwner(resourceQualifier)) {
            throw new ForbiddenException("Недостаточно прав для удаления разрешения: " + permissionId);
        }

        permissionRepository.deleteById(permissionId);

        return new Voidy();
    }
}
