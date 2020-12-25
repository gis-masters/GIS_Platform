package ru.mycrg.data_service.service.tables;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.TablesManager;
import ru.mycrg.data_service.dto.IResourceModel;
import ru.mycrg.data_service.dto.TableCreateDto;
import ru.mycrg.data_service.dto.TableModel;
import ru.mycrg.data_service.entity.Resource;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;
import ru.mycrg.data_service.service.resources.ResourcesService;

import java.util.ArrayList;

import static ru.mycrg.data_service.dao.TablesManager.EXTENSION_POSTFIX;
import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.security.CrgClaimsParser.isOrganizationAdmin;
import static ru.mycrg.data_service.security.CrgClaimsParser.isRoot;
import static ru.mycrg.data_service.service.resources.ResourceIdentifier.SEPARATOR;

@Service
public class TableService implements ITableService {

    public static final Logger log = LoggerFactory.getLogger(TableService.class);

    private final TablesManager tablesManager;
    private final ResourcesService resourcesService;

    public TableService(ResourcesService resourcesService, TablesManager tablesManager) {
        this.resourcesService = resourcesService;
        this.tablesManager = tablesManager;
    }

    @Override
    public IResourceModel create(ResourceIdentifier rIdentifier, TableCreateDto dto, Authentication authentication) {
        log.warn("ATTENTION. NOT CREATE REAL TABLE YET. Just write info to the resource description table");

        var oTable = resourcesService.getTable(rIdentifier.toString());
        if (oTable.isPresent()) {
            throw new ConflictException("Table already exist: " + rIdentifier.toString());
        }

        // Add resource description record
        Resource entity = new Resource(TABLE, dto, rIdentifier.toString(), authentication.getName());
        entity.setCrs(dto.getCrs());
        entity.setSchemaId(dto.getSchemaId());

        final Resource newEntity = resourcesService.save(entity);
        resourcesService.increaseItemsCounter(rIdentifier.getParent().toString());

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
            return resourcesService
                    .getDatasetTablesByTitle(schemaName, title, pageable)
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
            return resourcesService
                    .getTable(rIdentifier.toString())
                    .map(resourceDescription -> new TableModel(resourceDescription, OWNER))
                    .orElseThrow(() -> new NotFoundException(rIdentifier.toString()));
        } else {
            // TODO: Implement me
            return new TableModel();
        }
    }

    @Override
    public void delete(ResourceIdentifier rIdentifier, Authentication authentication) {
        resourcesService
                .getTable(rIdentifier.toString())
                .ifPresentOrElse(res -> {
                                     resourcesService.deleteByIdentifier(res.getIdentifier());
                                     tablesManager.delete(rIdentifier);

                                     String extTableName = rIdentifier.getId() + EXTENSION_POSTFIX;
                                     ResourceIdentifier extTable =
                                             new ResourceIdentifier(extTableName, TABLE, rIdentifier.getParent());
                                     tablesManager.delete(extTable);
                                 },
                                 () -> {
                                     throw new NotFoundException(rIdentifier.toString());
                                 });
    }

    private String extractTableName(String resourceIdentifier) {
        try {
            return resourceIdentifier.split(SEPARATOR)[1];
        } catch (IndexOutOfBoundsException e) {
            return "";
        }
    }
}
