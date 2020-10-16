package ru.mycrg.data_service.service.tables;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.SchemasDDL;
import ru.mycrg.data_service.dto.TableModel;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.repository.ResourceDescriptionRepository;
import ru.mycrg.data_service.security.UserDetails;
import ru.mycrg.data_service.service.PermissionsService;
import ru.mycrg.data_service.service.TableIdentifier;

import java.util.*;

import static ru.mycrg.data_service.dto.ResourceType.TABLE;
import static ru.mycrg.data_service.dto.Roles.OWNER;
import static ru.mycrg.data_service.security.CrgClaimsParser.*;
import static ru.mycrg.data_service.service.PageHandler.getPageableResource;

@Service
public class TableService implements ITableService {

    private final SchemasDDL schemasDDL;
    private final PermissionsService permissionsService;
    private final ResourceDescriptionRepository rdRepository;

    public TableService(SchemasDDL schemasDDL,
                        PermissionsService permissionsService,
                        ResourceDescriptionRepository rdRepository) {
        this.schemasDDL = schemasDDL;
        this.rdRepository = rdRepository;
        this.permissionsService = permissionsService;
    }

    @Override
    public Page<TableModel> getAllByTitle(String schemaName,
                                          String title,
                                          Pageable pageable,
                                          Authentication authentication) {
        if (isRoot(authentication)) {
            return new PageImpl<>(new ArrayList<>());
        } else if (isOrganizationAdmin(authentication)) {
            final Set<TableModel> datasets = new LinkedHashSet<>();

            // Таблицы с описанием
            rdRepository.findByTypeAndTitleContaining(TABLE.name(), title, pageable)
                        .forEach(description -> datasets.add(new TableModel(description, OWNER.name())));

            datasets.forEach(tableModel -> {
                tableModel.setResourceIdentifier(
                        new TableIdentifier(tableModel.getResourceIdentifier()).getTable());
            });

            return (Page<TableModel>) getPageableResource(Arrays.asList(datasets.toArray()), pageable);
        } else {
            final UserDetails userDetails = getUserDetails(authentication);

            List<String> tables = schemasDDL.getTables(schemaName);

            List<Long> ids = userDetails.getGroups();
            ids.add(userDetails.getUserId());

            List<TableModel> allByResource = permissionsService.getAllByResource(schemaName, ids);

            // TODO: Implement me
            return new PageImpl<>(new ArrayList<>());
        }
    }

    @Override
    public TableModel getByName(TableIdentifier resource, Authentication authentication) {
        if (isRoot(authentication)) {
            return new TableModel();
        } else if (isOrganizationAdmin(authentication)) {
            return rdRepository
                    .findByTypeAndResourceIdentifier(TABLE.name(), resource.toString())
                    .map(resourceDescription -> new TableModel(resourceDescription, OWNER.toString()))
                    .orElseGet(() -> new TableModel(resource.getTable(), OWNER.name()));
        } else {
            TableModel tableModel = new TableModel(resource.getTable());
            permissionsService
                    .identifyPermission(getUserDetails(authentication), resource.toString())
                    .ifPresentOrElse(tableModel::setPermission, () -> {
                        throw new ForbiddenException("Not allowed");
                    });

            return tableModel;
        }
    }
}
