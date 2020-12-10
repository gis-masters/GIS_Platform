package ru.mycrg.data_service.service.tables;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.data_service.dto.TableModel;
import ru.mycrg.data_service.entity.Resource;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.repository.ResourceRepository;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;
import ru.mycrg.data_service.service.resources.ResourcesService;

import javax.transaction.Transactional;
import java.util.ArrayList;

import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.security.CrgClaimsParser.isOrganizationAdmin;
import static ru.mycrg.data_service.security.CrgClaimsParser.isRoot;
import static ru.mycrg.data_service.service.resources.ResourceIdentifier.SEPARATOR;

@Service
@Transactional
public class TableService implements ITableService {

    public static final Logger log = LoggerFactory.getLogger(TableService.class);

    private final PermissionsService permissionsService;
    private final ResourceRepository resRepository;
    private final ResourcesService resourcesService;

    public TableService(PermissionsService permissionsService,
                        ResourcesService resourcesService,
                        ResourceRepository resRepository) {
        this.resRepository = resRepository;
        this.resourcesService = resourcesService;
        this.permissionsService = permissionsService;
    }

    @Override
    public IResourceModel create(ResourceIdentifier rIdentifier, ResourceCreateDto dto, Authentication authentication) {
        log.warn("ATTENTION. NOT CREATE REAL TABLE YET. Just write info to the resource description table");

        var oTable = resRepository.findByTypeAndIdentifier(TABLE.name(), rIdentifier.toString());
        if (oTable.isPresent()) {
            throw new ConflictException("Table already exist: " + rIdentifier.toString());
        }

        // Add resource description record
        Resource entity = new Resource(TABLE, dto, rIdentifier.toString(), authentication.getName());
        final Resource newEntity = resRepository.save(entity);
        resRepository.increaseItemsCounter(rIdentifier.getParent().toString());

        return new TableModel(newEntity, OWNER);
    }

    @Override
    public Page<IResourceModel> getPaged(String schemaName,
                                         String title,
                                         Pageable pageable,
                                         Authentication authentication) {
        if (isRoot(authentication)) {
            // TODO: Implement me
            return new PageImpl<>(new ArrayList<>());
        } else if (isOrganizationAdmin(authentication)) {
            return resRepository
                    .findByTypeAndIdentifierStartingWithAndTitleContaining(TABLE.name(), schemaName, title, pageable)
                    .map(description -> {
                        final IResourceModel resourceModel = new TableModel(description, OWNER);
                        final String tableName = extractTableName(resourceModel.getIdentifier());
                        resourceModel.setIdentifier(tableName);

                        return resourceModel;
                    });
        } else {
            // TODO: Implement me
            return new PageImpl<>(new ArrayList<>());
        }
    }

    @Override
    public IResourceModel getByIdentifier(ResourceIdentifier rIdentifier, Authentication authentication) {
        if (isRoot(authentication)) {
            // TODO: Implement me
            return new TableModel();
        } else if (isOrganizationAdmin(authentication)) {
            return resRepository
                    .findByTypeAndIdentifier(TABLE.name(), rIdentifier.toString())
                    .map(resourceDescription -> new TableModel(resourceDescription, OWNER))
                    .orElseThrow(() -> new NotFoundException(rIdentifier.toString()));
        } else {
            // TODO: Implement me
            return new TableModel();
        }
    }

    private String extractTableName(String resourceIdentifier) {
        try {
            return resourceIdentifier.split(SEPARATOR)[1];
        } catch (IndexOutOfBoundsException e) {
            return "";
        }
    }
}
