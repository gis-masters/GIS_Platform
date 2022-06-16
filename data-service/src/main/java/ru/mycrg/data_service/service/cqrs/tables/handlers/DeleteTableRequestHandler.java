package ru.mycrg.data_service.service.cqrs.tables.handlers;

import org.springframework.stereotype.Component;
import ru.mycrg.data_service.dao.ddl.DdlTables;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.security.IAuthenticationFacade;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.cqrs.tables.requests.DeleteTableRequest;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service_contract.queue.request.LayerReferencesDeletionEvent;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import static ru.mycrg.common_utils.CrgGlobalProperties.getScratchWorkspaceName;
import static ru.mycrg.data_service.dao.config.DaoProperties.EXTENSION_POSTFIX;

@Component
public class DeleteTableRequestHandler implements IRequestHandler<DeleteTableRequest, Voidy> {

    private final DdlTables ddlTables;
    private final SchemasAndTablesRepository schemasAndTablesRepository;
    private final PermissionsService permissionsService;
    private final IMessageBusProducer messageBus;
    private final IAuthenticationFacade authenticationFacade;

    public DeleteTableRequestHandler(DdlTables ddlTables,
                                     SchemasAndTablesRepository schemasAndTablesRepository,
                                     PermissionsService permissionsService,
                                     IMessageBusProducer messageBus,
                                     IAuthenticationFacade authenticationFacade) {
        this.ddlTables = ddlTables;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.permissionsService = permissionsService;
        this.messageBus = messageBus;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public Voidy handle(DeleteTableRequest request) {
        ResourceQualifier tQualifier = request.gettQualifier();

        SchemasAndTables table = schemasAndTablesRepository
                .findByIdentifier(tQualifier.getTable())
                .orElseThrow(() -> new NotFoundException(tQualifier));

        // resourceProtector.throwIfDeletionNotAllowed(targetTable, table.getId());

        schemasAndTablesRepository.deleteByIdentifier(table.getIdentifier());

        // Delete assigned rule
        permissionsService.deleteAssigned(tQualifier, table.getId());

        String extTableName = tQualifier.getTable() + EXTENSION_POSTFIX;
        ResourceQualifier extTable = new ResourceQualifier(tQualifier.getSchema(), extTableName);

        ddlTables.drop(tQualifier);
        ddlTables.drop(extTable);

        messageBus.produce(
                new LayerReferencesDeletionEvent(getScratchWorkspaceName(authenticationFacade.getOrganizationId()),
                                                 tQualifier.getSchema(),
                                                 tQualifier.getTable(),
                                                 authenticationFacade.getAccessToken()));

        return new Voidy();
    }
}
