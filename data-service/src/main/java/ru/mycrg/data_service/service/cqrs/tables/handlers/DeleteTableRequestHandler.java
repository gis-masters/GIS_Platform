package ru.mycrg.data_service.service.cqrs.tables.handlers;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service.dao.FtsDao;
import ru.mycrg.data_service.dao.ddl.tables.DdlTablesBase;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
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

    private final FtsDao ftsDao;
    private final DdlTablesBase ddlTablesBase;
    private final IMessageBusProducer messageBus;
    private final PermissionsService permissionsService;
    private final IAuthenticationFacade authenticationFacade;
    private final SchemasAndTablesRepository schemasAndTablesRepository;

    public DeleteTableRequestHandler(FtsDao ftsDao,
                                     DdlTablesBase ddlTablesBase,
                                     IMessageBusProducer messageBus,
                                     PermissionsService permissionsService,
                                     IAuthenticationFacade authenticationFacade,
                                     SchemasAndTablesRepository schemasAndTablesRepository) {
        this.ftsDao = ftsDao;
        this.messageBus = messageBus;
        this.ddlTablesBase = ddlTablesBase;
        this.permissionsService = permissionsService;
        this.authenticationFacade = authenticationFacade;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
    }

    @Override
    @Transactional
    public Voidy handle(DeleteTableRequest request) {
        ResourceQualifier qualifier = request.gettQualifier();

        SchemasAndTables table = schemasAndTablesRepository
                .findByIdentifier(qualifier.getTable())
                .orElseThrow(() -> new NotFoundException(qualifier));

        schemasAndTablesRepository.deleteByIdentifier(table.getIdentifier());

        // Delete assigned rule
        permissionsService.deleteAssigned(qualifier, table.getId());

        String extTableName = qualifier.getTable() + EXTENSION_POSTFIX;
        ResourceQualifier extTable = new ResourceQualifier(qualifier.getSchema(), extTableName);

        ddlTablesBase.drop(qualifier);
        ddlTablesBase.drop(extTable);

        ftsDao.dropSourceData(qualifier);

        messageBus.produce(
                new LayerReferencesDeletionEvent(getScratchWorkspaceName(authenticationFacade.getOrganizationId()),
                                                 qualifier.getSchema(),
                                                 qualifier.getTable(),
                                                 authenticationFacade.getAccessToken()));

        return new Voidy();
    }
}
