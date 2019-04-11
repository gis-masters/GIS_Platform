package ru.mycrg.wrapper.service.geoserver;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.OrgMqRequest;
import ru.mycrg.wrapper.dao.GisStorage;
import ru.mycrg.wrapper.service.geoserver.rule.RulesService;
import ru.mycrg.wrapper.service.geoserver.storage.StorageService;
import ru.mycrg.wrapper.service.geoserver.user_role.UsersAndRolesService;
import ru.mycrg.wrapper.service.geoserver.workspace.WorkspacesService;

import java.io.IOException;

import static ru.mycrg.wrapper.service.geoserver.GeoServerConstants.DEFAULT_DB_NAME;
import static ru.mycrg.wrapper.service.geoserver.GeoServerConstants.DEFAULT_ROLE_NAME;

@Service
public class OrganizationService {

    private final WorkspacesService workspacesService;
    private final UsersAndRolesService usersAndRolesService;
    private final RulesService rulesService;
    private final GisStorage gisStorage;
    private final StorageService storageService;

    @Autowired
    public OrganizationService(WorkspacesService workspacesService, UsersAndRolesService usersAndRolesService,
                               RulesService rulesService, StorageService storageService, GisStorage gisStorage) {
        this.workspacesService = workspacesService;
        this.usersAndRolesService = usersAndRolesService;
        this.rulesService = rulesService;
        this.storageService = storageService;
        this.gisStorage = gisStorage;
    }

    /**
     * Создание организации.
     */
    public void createOrganization(OrgMqRequest dto) throws IOException, RuntimeException {
        String roleName = DEFAULT_ROLE_NAME + dto.getOrgId();

        usersAndRolesService.createUser(dto.getEmail(), dto.getRawPassword());
        usersAndRolesService.createRole(roleName);
        rulesService.addRestRule(roleName);

        usersAndRolesService.associateUserWithRole(dto.getUserName(), roleName);

        gisStorage.createDb("database_" + dto.getOrgId());
    }

    /**
     * Создание проекта.
     * Создание хранилища (postgis) на геосервере.
     */
    public void createProject(OrgMqRequest dto) throws IOException, RuntimeException {
        Long id = dto.getOrgId();

        String workspaceName = dto.getWorkspaceName();
        String databaseName = DEFAULT_DB_NAME + "_" + id;
        String storeName = databaseName + "_store";

        workspacesService.createWorkspace(workspaceName);
        rulesService.addLayersRule(
                GeoServerUtil.buildRule(workspaceName, GeoServerPermissions.ADMIN), DEFAULT_ROLE_NAME + dto.getOrgId());

        gisStorage.initP10Database(databaseName, workspaceName);

        storageService.createStorage(databaseName, workspaceName, storeName);
    }

}
