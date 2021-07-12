package ru.mycrg.data_service.service.resources;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.data_service.dao.BasePermissionsRepository;
import ru.mycrg.data_service.dao.SchemasManager;
import ru.mycrg.data_service.dto.DatasetModel;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.data_service.dto.Roles;
import ru.mycrg.data_service.entity.Permission;
import ru.mycrg.data_service.entity.Role;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.http_client.ResponseModel;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;
import static ru.mycrg.data_service.dto.Roles.OWNER;

@Service
public class DatasetService extends SchemasAndTablesBase {

    public static final Logger log = LoggerFactory.getLogger(DatasetService.class);

    public static final String SCHEMA_PREFIX = "dataset";

    private final BasePermissionsRepository permissionsRepository;
    private final SchemasManager schemasManager;
    private final DataStoreClient dataStoreClient;
    private final ResourceProtector resourceProtector;
    private final SchemasAndTablesRepository schemasAndTablesRepository;
    private final PermissionsService permissionsService;

    private final String SYSTEM_ROOT_FOLDER_PATH = "/root";

    public DatasetService(BasePermissionsRepository permissionsRepository,
                          ResourceProtector resourceProtector,
                          SchemasManager schemasManager,
                          DataStoreClient dataStoreClient,
                          SchemasAndTablesRepository schemasAndTablesRepository,
                          PermissionsService permissionsService) {
        this.permissionsRepository = permissionsRepository;
        this.schemasManager = schemasManager;
        this.dataStoreClient = dataStoreClient;
        this.resourceProtector = resourceProtector;
        this.schemasAndTablesRepository = schemasAndTablesRepository;
        this.permissionsService = permissionsService;
    }

    public Page<IResourceModel> getPaged(String title, Pageable pageable) {
        final List<IResourceModel> allowedResources = permissionsRepository
                .findAllowedByParent(schemasAndTablesQualifier, SYSTEM_ROOT_FOLDER_PATH, title, pageable).stream()
                .map(record -> new DatasetModel(record.getContent()))
                .collect(Collectors.toList());

        final long total = permissionsRepository.getTotalByParent(schemasAndTablesQualifier, SYSTEM_ROOT_FOLDER_PATH, title);

        return new PageImpl<>(allowedResources, pageable, total);
    }

    public IResourceModel getInfo(String datasetIdentifier) {
        final SchemasAndTables dataset = schemasAndTablesRepository
                .findByIdentifier(datasetIdentifier)
                .orElseThrow(() -> new NotFoundException(datasetIdentifier));

        final Optional<Role> oRole = permissionsService.getBestDatasetRole(schemasAndTablesQualifier, dataset.getId());
        if (oRole.isPresent()) { // There is permission directly for the schema
            return new DatasetModel(dataset, oRole.get().getName());
        } else { // Check if schema allowed for view by permissions from children
            if (permissionsRepository.isViewAllowed(schemasAndTablesQualifier, dataset.pathTo())) {
                return new DatasetModel(dataset, Roles.VIEWER.name());
            } else {
                throw new ForbiddenException("You don't have permission to resource: " + datasetIdentifier);
            }
        }
    }

    public DatasetModel create(ResourceCreateDto dto) {
        String datasetId = String.format("%s_%s", SCHEMA_PREFIX, UUID.randomUUID().toString().substring(0, 6));

        ResourceQualifier rDataset = new ResourceQualifier(datasetId);
        resourceProtector.throwIfExists(rDataset);

        // Create schema
        schemasManager.create(rDataset);

        // Add record to schemasAndTables table
        final SchemasAndTables dataset = new SchemasAndTables(SCHEMA, dto, datasetId, SYSTEM_ROOT_FOLDER_PATH);
        final SchemasAndTables newEntity = schemasAndTablesRepository.save(dataset);

        // Create OWNER permission
        final Permission ownerPermission = permissionsService.addOwnerPermission(schemasAndTablesQualifier, newEntity.getId());

        ResponseModel<Object> responseModel = dataStoreClient.create(datasetId);
        if (!responseModel.isSuccessful()) {
            schemasAndTablesRepository.delete(newEntity);
            schemasManager.delete(rDataset);
            permissionsService.delete(ownerPermission);

            throw new DataServiceException("Не удалось создать хранилище на gis-service", responseModel);
        }

        return new DatasetModel(newEntity, OWNER.name());
    }

    @Transactional
    public void delete(ResourceQualifier datasetQualifier) {
        final SchemasAndTables dataset = schemasAndTablesRepository
                .findByIdentifier(datasetQualifier.toString())
                .orElseThrow(() -> new NotFoundException(datasetQualifier));

        if (!resourceProtector.isOwner(datasetQualifier)) {
            throw new ForbiddenException();
        }

        // Delete from DB
        schemasManager.delete(datasetQualifier);

        // Delete from information table
        schemasAndTablesRepository.deleteByIdentifier(datasetQualifier.toString());

        // Delete from geoserver
        ResponseModel<Object> responseModel = dataStoreClient.delete(datasetQualifier.toString());
        if (!responseModel.isSuccessful()) {
            log.warn("Не удалось удалить хранилище на gis-service: {}", responseModel);
        }

        // Delete assigned rule
        permissionsService.deleteAssigned(schemasAndTablesQualifier, dataset.getId());
    }
}
