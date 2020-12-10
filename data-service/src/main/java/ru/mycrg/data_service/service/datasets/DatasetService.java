package ru.mycrg.data_service.service.datasets;

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
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.ResourceRepository;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;
import ru.mycrg.data_service.service.resources.ResourceProtector;

import javax.transaction.Transactional;
import java.util.ArrayList;

import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.security.CrgClaimsParser.isOrganizationAdmin;
import static ru.mycrg.data_service.security.CrgClaimsParser.isRoot;

@Service
@Transactional
public class DatasetService implements IDatasetService {

    private final SchemasManager schemasDDL;
    private final ResourceProtector resourceProtector;
    private final ResourceRepository resRepository;

    public DatasetService(ResourceRepository resRepository,
                          ResourceProtector resourceProtector,
                          SchemasManager schemasDDL) {
        this.schemasDDL = schemasDDL;
        this.resRepository = resRepository;
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
        ResourceIdentifier rIdentifier = new ResourceIdentifier(dto.getName(), SCHEMA);
        resourceProtector.throwIfExists(rIdentifier);

        // Create schema
        schemasDDL.create(rIdentifier);

        // Add resource description record
        Resource entity = new Resource(SCHEMA, dto, rIdentifier.toString(), authentication.getName());
        final Resource newEntity = resRepository.save(entity);

        return new DatasetModel(newEntity, OWNER);
    }

    @Override
    public void delete(String datasetId) {
        ResourceIdentifier rIdentifier = new ResourceIdentifier(datasetId, SCHEMA);

        schemasDDL.delete(rIdentifier);

        resRepository.findByTypeAndIdentifier(SCHEMA.name(), datasetId)
                     .ifPresentOrElse(res -> resRepository.deleteByIdentifierStartsWith(res.getIdentifier()),
                                      () -> {
                                          throw new NotFoundException(datasetId);
                                      });
    }
}
