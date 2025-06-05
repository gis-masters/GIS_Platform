package ru.mycrg.data_service.service.cqrs.tables.handlers;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.dto.TableUpdateDto;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.cqrs.tables.requests.UpdateTableRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

import java.util.Optional;

import static java.time.LocalDateTime.now;
import static java.util.Objects.nonNull;

@Component
public class UpdateTableRequestHandler implements IRequestHandler<UpdateTableRequest, Voidy> {

    private final IAuthenticationFacade authenticationFacade;
    private final SchemasAndTablesRepository schemasAndTablesRepository;
    private final PermissionsService permissionsService;
    private final BasePermissionsRepository permissionsRepository;

    public UpdateTableRequestHandler(PermissionsService permissionsService,
                                     IAuthenticationFacade authenticationFacade,
                                     SchemasAndTablesRepository schemasAndTablesRepository,
                                     BasePermissionsRepository permissionsRepository) {
        this.authenticationFacade = authenticationFacade;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.permissionsService = permissionsService;
        this.permissionsRepository = permissionsRepository;
    }

    @Override
    @Transactional
    public Voidy handle(UpdateTableRequest request) {
        ResourceQualifier qualifier = request.getQualifier();
        if (!isOwner(qualifier)) {
            throw new ForbiddenException("Недостаточно прав для редактирования информации о слое: " + qualifier);
        }

        SchemasAndTables tableForUpdate = schemasAndTablesRepository
                .findByIdentifier(qualifier.getTable())
                .orElseThrow(() -> new NotFoundException("Не найдена таблица: " + qualifier.getTable()));

        TableUpdateDto dto = request.getDto();
        if (nonNull(dto.getTitle())) {
            tableForUpdate.setTitle(dto.getTitle());
        }

        if (nonNull(dto.getDetails())) {
            tableForUpdate.setDetails(dto.getDetails());
        }

        if (nonNull(dto.getDocumentType())) {
            tableForUpdate.setDocumentType(dto.getDocumentType());
        }

        if (nonNull(dto.getCrs())) {
            tableForUpdate.setCrs(dto.getCrs());
        }

        if (nonNull(dto.getStatus())) {
            tableForUpdate.setStatus(dto.getStatus());
        }

        if (nonNull(dto.getIsPublic())) {
            tableForUpdate.setIsPublic(dto.getIsPublic());
        }

        if (nonNull(dto.getReadyForFts())) {
            tableForUpdate.setReadyForFts(dto.getReadyForFts());
        }

        if (nonNull(dto.getDocApproveDate())) {
            tableForUpdate.setDocApproveDate(dto.getDocApproveDate().atStartOfDay());
        }

        if (nonNull(dto.getDocTerminationDate())) {
            tableForUpdate.setDocTerminationDate(dto.getDocTerminationDate().atStartOfDay());
        }

        if (nonNull(dto.getFias__oktmo())) {
            tableForUpdate.setFiasOktmo(dto.getFias__oktmo());
        }

        if (nonNull(dto.getFias__id())) {
            tableForUpdate.setFiasId(dto.getFias__id());
        }

        if (nonNull(dto.getFias__address())) {
            tableForUpdate.setFiasAdress(dto.getFias__address());
        }

        tableForUpdate.setLastModified(now());

        request.setTableModel(tableForUpdate);

        schemasAndTablesRepository.save(tableForUpdate);

        return new Voidy();
    }

    private boolean isOwner(ResourceQualifier resourceQualifier) {
        if (authenticationFacade.isOrganizationAdmin()) {
            return true;
        }

        final Long userId = authenticationFacade.getUserDetails().getUserId();

        permissionsService.getAllByResourceId(resourceQualifier, userId, Pageable.unpaged());
        Optional<String> roleForDataset = permissionsRepository.getBestRoleForDataset(resourceQualifier);

        return roleForDataset.filter("OWNER"::equals).isPresent();
    }
}
