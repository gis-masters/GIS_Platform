package ru.mycrg.data_service.service.datasets;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.SchemasDDL;
import ru.mycrg.data_service.dto.DatasetCreateDto;
import ru.mycrg.data_service.dto.DatasetModel;
import ru.mycrg.data_service.entity.ResourceDescription;
import ru.mycrg.data_service.entity.TypeResourceIdentifierKey;
import ru.mycrg.data_service.repository.ResourceDescriptionRepository;

import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;

import static ru.mycrg.data_service.dto.ResourceType.SCHEMA;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.security.CrgClaimsParser.isOrganizationAdmin;
import static ru.mycrg.data_service.security.CrgClaimsParser.isRoot;

@Service
@Transactional
public class DatasetService implements IDatasetService {

    private final SchemasDDL schemasDDL;
    private final ResourceDescriptionRepository rdRepository;

    public DatasetService(ResourceDescriptionRepository rdRepository,
                          SchemasDDL schemasDDL) {
        this.schemasDDL = schemasDDL;
        this.rdRepository = rdRepository;
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
                    .map(description -> new DatasetModel(description, OWNER.name()));
        } else {
            return new PageImpl<>(new ArrayList<>());
        }
    }

    @Override
    public DatasetModel getByName(String schemaName, Authentication authentication) {
        if (isRoot(authentication)) {
            return new DatasetModel();
        } else if (isOrganizationAdmin(authentication)) {
            return rdRepository
                    .findByTypeAndResourceIdentifier(SCHEMA.name(), schemaName)
                    .map(resourceDescription -> new DatasetModel(resourceDescription, OWNER.name()))
                    .orElseGet(() -> new DatasetModel(schemaName, OWNER.name()));
        } else {
            return new DatasetModel();
        }
    }

    @Override
    public DatasetModel create(DatasetCreateDto dto, Authentication authentication) {
        // Create schema
        schemasDDL.create(dto.getName());

        // Add resource description record
        final ResourceDescription rDescription = new ResourceDescription();
        rDescription.setKey(new TypeResourceIdentifierKey(SCHEMA.name(), dto.getName()));
        rDescription.setTitle(dto.getTitle());
        rDescription.setDetails(dto.getDetails());
        rDescription.setType(SCHEMA.name());
        rDescription.setResourceIdentifier(dto.getName());
        rDescription.setItemsCount(0);
        rDescription.setCreatedAt(LocalDateTime.now());
        rDescription.setLastModified(LocalDateTime.now());

        final ResourceDescription newEntity = rdRepository.save(rDescription);

        return new DatasetModel(newEntity, OWNER.name());
    }
}
