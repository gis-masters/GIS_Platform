package ru.mycrg.data_service.service;

import lombok.extern.log4j.Log4j2;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.TablesDao;
import ru.mycrg.data_service.dao.TablesDDL;
import ru.mycrg.data_service.dao.exceptions.CrgDaoException;
import ru.mycrg.data_service.dto.Roles;
import ru.mycrg.data_service.dto.TableDto;
import ru.mycrg.data_service.entity.ITableObject;
import ru.mycrg.data_service.entity.ITableObjectImpl;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.security.UserDetails;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static ru.mycrg.data_service.security.CrgClaimsParser.getUserDetails;
import static ru.mycrg.data_service.security.CrgClaimsParser.isOrganizationAdmin;

@Log4j2
@Service
public class TableService {

    private final PermissionsService permissionsService;
    private final TablesDDL tablesDDL;
    private final TablesDao tablesDao;

    public TableService(PermissionsService permissionsService,
                        TablesDao tablesDao,
                        TablesDDL tablesDDL) {
        this.permissionsService = permissionsService;
        this.tablesDao = tablesDao;
        this.tablesDDL = tablesDDL;
    }

    public Page<TableDto> getTables(String schemaName, Authentication authentication, Pageable pageable) {
        UserDetails userDetails = getUserDetails(authentication);
        List<Long> ids = userDetails.getGroups();
        ids.add(userDetails.getUserId());

        List<TableDto> allByResource = permissionsService.getAllByResource(schemaName, ids);

        long start = pageable.getOffset();
        long end = (start + pageable.getPageSize()) > allByResource.size()
                ? allByResource.size()
                : (start + pageable.getPageSize());

        return new PageImpl<>(allByResource.subList((int) start, (int) end), pageable, allByResource.size());
    }

    public TableDto getByName(TableIdentifier resource, Authentication authentication) {
        if (!tablesDDL.isTableExist(resource)) {
            throw new NotFoundException("No found layer: " + resource);
        }

        TableDto tableDto = new TableDto(resource.getTable());
        if (isOrganizationAdmin(authentication)) {
            tableDto.setPermission(Roles.OWNER.toString());
            return tableDto;
        }

        UserDetails userDetails = getUserDetails(authentication);

        permissionsService
                .identifyPermission(userDetails, resource.toString())
                .ifPresentOrElse(tableDto::setPermission, () -> {
                    throw new ForbiddenException("Not allowed");
                });

        return tableDto;
    }

    public LinkedHashMap getById(TableIdentifier table, UUID id, Authentication authentication) {
        if (!tablesDDL.isTableExist(table)) {
            throw new NotFoundException("No found table: " + table.toString());
        }

        return tablesDao
                .findById(table, id)
                .orElseThrow(() -> {
                    throw new NotFoundException(id);
                });
    }

    public ITableObject createObject(TableIdentifier resource,
                                     Map<String, Object> body,
                                     Authentication authentication) throws CrgDaoException {
        if (!tablesDDL.isTableExist(resource)) {
            throw new NotFoundException("No found table: " + resource.toString());
        }

        UUID id = tablesDao.addRecord(resource, body);

        return new ITableObjectImpl(id);
    }

    public void deleteObject(TableIdentifier tableIdentifier, UUID id, Authentication authentication) {
        if (!tablesDDL.isTableExist(tableIdentifier)) {
            throw new NotFoundException("No found table: " + tableIdentifier.toString());
        }

        tablesDao.removeRecord(tableIdentifier, id);
    }
}
