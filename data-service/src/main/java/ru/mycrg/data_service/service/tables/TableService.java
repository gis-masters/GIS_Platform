package ru.mycrg.data_service.service.tables;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dto.ResourceCreateDto;
import ru.mycrg.data_service.dto.TableModel;
import ru.mycrg.data_service.entity.ResourceDescription;
import ru.mycrg.data_service.exceptions.ConflictException;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.repository.ResourceDescriptionRepository;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.resources.ResourceIdentifier;

import javax.transaction.Transactional;
import java.util.ArrayList;

import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.security.CrgClaimsParser.*;
import static ru.mycrg.data_service.service.resources.ResourceIdentifier.SEPARATOR;

@Service
@Transactional
public class TableService implements ITableService {

    public static final Logger log = LoggerFactory.getLogger(TableService.class);

    private final PermissionsService permissionsService;
    private final ResourceDescriptionRepository rdRepository;

    public TableService(PermissionsService permissionsService,
                        ResourceDescriptionRepository rdRepository) {
        this.rdRepository = rdRepository;
        this.permissionsService = permissionsService;
    }

    @Override
    public TableModel create(ResourceIdentifier rIdentifier, ResourceCreateDto dto, Authentication authentication) {
        log.warn("ATTENTION. NOT CREATE REAL TABLE YET. Just write info to the resource description table");

        var oTable = rdRepository.findByTypeAndIdentifier(TABLE.name(), rIdentifier.toString());
        if (oTable.isPresent()) {
            throw new ConflictException("Table already exist: " + rIdentifier.toString());
        }

        // Add resource description record
        ResourceDescription entity =
                new ResourceDescription(TABLE, dto, rIdentifier.toString(), authentication.getName());
        final ResourceDescription newEntity = rdRepository.save(entity);
        rdRepository.increaseItemsCounter(rIdentifier.getParent().toString());

        return new TableModel(newEntity, OWNER);
    }

    @Override
    public Page<TableModel> getPaged(String schemaName,
                                     String title,
                                     Pageable pageable,
                                     Authentication authentication) {
        if (isRoot(authentication)) {
            // TODO: Implement me
            return new PageImpl<>(new ArrayList<>());
        } else if (isOrganizationAdmin(authentication)) {
            return rdRepository
                    .findByTypeAndIdentifierStartingWithAndTitleContaining(TABLE.name(), schemaName, title, pageable)
                    .map(description -> {
                        final TableModel tableModel = new TableModel(description, OWNER);
                        final String tableName = extractTableName(tableModel.getResourceIdentifier());
                        tableModel.setResourceIdentifier(tableName);

                        return tableModel;
                    });
        } else {
            // TODO: Implement me
            return new PageImpl<>(new ArrayList<>());
        }
    }

    @Override
    public TableModel getByIdentifier(ResourceIdentifier rIdentifier, Authentication authentication) {
        if (isRoot(authentication)) {
            // TODO: Implement me
            return new TableModel();
        } else if (isOrganizationAdmin(authentication)) {
            return rdRepository
                    .findByTypeAndIdentifier(TABLE.name(), rIdentifier.toString())
                    .map(resourceDescription -> new TableModel(resourceDescription, OWNER))
                    .orElseGet(() -> new TableModel(rIdentifier.getId(), OWNER));
        } else {
            TableModel tableModel = new TableModel(rIdentifier.getId());
            permissionsService
                    .identifyPermission(getUserDetails(authentication), rIdentifier.toString())
                    .ifPresentOrElse(tableModel::setPermission, () -> {
                        throw new ForbiddenException("Not allowed");
                    });

            return tableModel;
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
