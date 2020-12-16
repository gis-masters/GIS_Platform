package ru.mycrg.data_service.service.datasets;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.SchemasManager;
import ru.mycrg.data_service.dto.DatasetModel;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.data_service.entity.Resource;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.ResourceRepository;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;
import ru.mycrg.data_service.service.resources.ResourceProtector;
import ru.mycrg.http_client.ResponseModel;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.UUID;

import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.security.CrgClaimsParser.isOrganizationAdmin;
import static ru.mycrg.data_service.security.CrgClaimsParser.isRoot;

@Service
@Transactional
public class DatasetService implements IDatasetService {

    public static final Logger log = LoggerFactory.getLogger(DatasetService.class);

    public static final String SCHEMA_PREFIX = "dataset";

    private final SchemasManager schemasDDL;
    private final ResourceProtector resourceProtector;
    private final ResourceRepository resRepository;
    private final DataStoreClient dataStoreClient;

    public DatasetService(ResourceRepository resRepository,
                          ResourceProtector resourceProtector,
                          SchemasManager schemasDDL,
                          DataStoreClient dataStoreClient) {
        this.schemasDDL = schemasDDL;
        this.resRepository = resRepository;
        this.dataStoreClient = dataStoreClient;
        this.resourceProtector = resourceProtector;
    }

    @Override
    public Page<IResourceModel> getPaged(String title,
                                         Pageable pageable,
                                         Authentication authentication) {
        if (isRoot(authentication)) {
            return new PageImpl<>(new ArrayList<>());
        } else if (isOrganizationAdmin(authentication)) {
            return resRepository.findByTypeAndTitleContaining(SCHEMA.name(), title, pageable)
                                .map(resource -> new DatasetModel(resource, OWNER));
        } else {
            return new PageImpl<>(new ArrayList<>());
        }
    }

    @Override
    public IResourceModel getByName(String datasetName, Authentication authentication) {
        if (isRoot(authentication)) {
            return new DatasetModel();
        } else if (isOrganizationAdmin(authentication)) {
            return resRepository.findByTypeAndIdentifier(SCHEMA.name(), datasetName)
                                .map(resource -> new DatasetModel(resource, OWNER))
                                .orElseThrow(() -> new NotFoundException(datasetName));
        } else {
            return new DatasetModel();
        }
    }

    @Override
    public DatasetModel create(ResourceCreateDto dto, Authentication authentication) {
        String datasetId = String.format("%s_%s", SCHEMA_PREFIX, UUID.randomUUID().toString().substring(0, 6));

        ResourceIdentifier rIdentifier = new ResourceIdentifier(datasetId, SCHEMA);
        resourceProtector.throwIfExists(rIdentifier);

        // Create schema
        schemasDDL.create(rIdentifier);

        // Add resource description record
        Resource entity = new Resource(SCHEMA, dto, rIdentifier.toString(), authentication.getName());
        final Resource newEntity = resRepository.save(entity);

        ResponseModel<Object> responseModel = dataStoreClient.create(datasetId, authentication);
        if (!responseModel.isSuccessful()) {
            resRepository.delete(newEntity);
            schemasDDL.delete(rIdentifier);

            throw new DataServiceException("Не удалось создать хранилище на gis-service", responseModel);
        }

        return new DatasetModel(newEntity, OWNER);
    }

    @Override
    public void delete(String datasetId, Authentication authentication) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(datasetId, SCHEMA);

        schemasDDL.delete(rIdentifier);

        resRepository.findByTypeAndIdentifier(SCHEMA.name(), datasetId)
                     .ifPresentOrElse(res -> resRepository.deleteByIdentifierStartsWith(res.getIdentifier()),
                                      () -> {
                                          throw new NotFoundException(datasetId);
                                      });

        ResponseModel<Object> responseModel = dataStoreClient.delete(datasetId, authentication);
        if (!responseModel.isSuccessful()) {
            log.warn("Не удалось удалить хранилище на gis-service: {}", responseModel);
        }
    }
}
