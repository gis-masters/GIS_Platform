package ru.mycrg.data_service.service.datasets;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.SchemasManager;
import ru.mycrg.data_service.dto.DatasetModel;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.data_service.entity.ResourceDescription;
import ru.mycrg.data_service.repository.ResourceDescriptionRepository;
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
    private final ResourceDescriptionRepository rdRepository;

    public DatasetService(ResourceDescriptionRepository rdRepository,
                          ResourceProtector resourceProtector,
                          SchemasManager schemasDDL) {
        this.schemasDDL = schemasDDL;
        this.rdRepository = rdRepository;
        this.resourceProtector = resourceProtector;
    }

    @Override
    public Page<DatasetModel> getPaged(String title,
                                       Pageable pageable,
                                       Authentication authentication) {
        if (isRoot(authentication)) {
            return new PageImpl<>(new ArrayList<>());
        } else if (isOrganizationAdmin(authentication)) {
            return rdRepository
                    .findByTypeAndTitleContaining(SCHEMA.name(), title, pageable)
                    .map(description -> new DatasetModel(description, OWNER));
        } else {
            return new PageImpl<>(new ArrayList<>());
        }
    }

    @Override
    public DatasetModel getByName(String datasetName, Authentication authentication) {
        if (isRoot(authentication)) {
            return new DatasetModel();
        } else if (isOrganizationAdmin(authentication)) {
            return rdRepository.findByTypeAndIdentifier(SCHEMA.name(), datasetName)
                               .map(rDescription -> new DatasetModel(rDescription, OWNER))
                               .orElseGet(() -> new DatasetModel(datasetName, OWNER));
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
        ResourceDescription entity =
                new ResourceDescription(SCHEMA, dto, rIdentifier.toString(), authentication.getName());
        final ResourceDescription newEntity = rdRepository.save(entity);

        return new DatasetModel(newEntity, OWNER);
    }
}
