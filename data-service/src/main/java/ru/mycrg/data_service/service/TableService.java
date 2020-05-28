package ru.mycrg.data_service.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.TablesDDL;
import ru.mycrg.data_service.dto.Roles;
import ru.mycrg.data_service.dto.TableDto;
import ru.mycrg.data_service.exceptions.ForbiddenException;
import ru.mycrg.data_service.exceptions.NotFoundException;
import ru.mycrg.data_service.security.UserDetails;

import java.util.List;

import static ru.mycrg.data_service.security.CrgClaimsParser.getUserDetails;
import static ru.mycrg.data_service.security.CrgClaimsParser.isOrganizationAdmin;
import static ru.mycrg.data_service.service.ResourceIdentifier.makeIdentifier;

@Service
public class TableService {

    private final PermissionsService permissionsService;
    private final TablesDDL tablesDDL;

    public TableService(PermissionsService permissionsService,
                        TablesDDL tablesDDL) {
        this.permissionsService = permissionsService;
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

    public TableDto getByName(Authentication authentication, String schemaName, String tableName) {
        String resourceIdentifier = makeIdentifier(schemaName, tableName);
        if (!tablesDDL.isTableExist(schemaName, tableName)) {
            throw new NotFoundException("No found layer: " + resourceIdentifier);
        }

        TableDto tableDto = new TableDto(tableName);
        if (isOrganizationAdmin(authentication)) {
            tableDto.setPermission(Roles.OWNER.toString());
            return tableDto;
        }

        UserDetails userDetails = getUserDetails(authentication);

        permissionsService
                .identifyPermission(userDetails, resourceIdentifier)
                .ifPresentOrElse(tableDto::setPermission, () -> {
                    throw new ForbiddenException("Not allowed");
                });

        return tableDto;
    }

}
