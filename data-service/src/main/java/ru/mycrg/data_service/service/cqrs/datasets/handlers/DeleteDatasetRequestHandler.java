package ru.mycrg.data_service.service.cqrs.datasets.handlers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.ddl.schemas.DdlSchemas;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.cqrs.datasets.requests.DeleteDatasetRequest;
import ru.mycrg.data_service.service.resources.DataStoreClient;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.data_service.service.resources.protectors.IMasterResourceProtector;
import ru.mycrg.data_service.service.resources.protectors.MasterResourceProtector;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.mediator.IRequestHandler;
import ru.mycrg.mediator.Voidy;

@Component
public class DeleteDatasetRequestHandler implements IRequestHandler<DeleteDatasetRequest, Voidy> {

    private final Logger log = LoggerFactory.getLogger(DeleteDatasetRequestHandler.class);

    private final DdlSchemas ddlSchemas;
    private final DataStoreClient dataStoreClient;
    private final IMasterResourceProtector resourceProtector;
    private final SchemasAndTablesRepository schemasAndTablesRepository;
    private final PermissionsService permissionsService;

    public DeleteDatasetRequestHandler(DdlSchemas ddlSchemas,
                                       DataStoreClient dataStoreClient,
                                       MasterResourceProtector resourceProtector,
                                       SchemasAndTablesRepository schemasAndTablesRepository,
                                       PermissionsService permissionsService) {
        this.ddlSchemas = ddlSchemas;
        this.dataStoreClient = dataStoreClient;
        this.resourceProtector = resourceProtector;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.permissionsService = permissionsService;
    }

    @Override
    @Transactional
    public Voidy handle(DeleteDatasetRequest request) {
        ResourceQualifier datasetQualifier = request.getDatasetQualifier();

        if (!resourceProtector.isOwner(datasetQualifier)) {
            throw new ForbiddenException("Недостаточно прав для удаления набора: " + datasetQualifier.getQualifier());
        }

        // Delete from DB
        ddlSchemas.drop(datasetQualifier);

        // Delete dataset from information table
        schemasAndTablesRepository.deleteByIdentifier(datasetQualifier.toString());

        // Delete from geoserver
        ResponseModel<Object> responseModel = dataStoreClient.delete(datasetQualifier.toString());
        if (!responseModel.isSuccessful()) {
            log.warn("Не удалось удалить хранилище на gis-service: {}", responseModel);
        }

        // Delete assigned rule
        schemasAndTablesRepository
                .findByIdentifier(datasetQualifier.toString())
                .ifPresent(dataset -> {
                    permissionsService.deleteAssigned(datasetQualifier, dataset.getId());
                });

        return new Voidy();
    }
}
