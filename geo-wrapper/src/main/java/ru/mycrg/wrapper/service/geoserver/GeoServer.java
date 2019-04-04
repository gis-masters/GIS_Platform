package ru.mycrg.wrapper.service.geoserver;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.wrapper.dao.GisStorage;
import ru.mycrg.wrapper.service.geoserver.rule.RulesService;
import ru.mycrg.wrapper.service.geoserver.storage.StorageService;
import ru.mycrg.wrapper.service.geoserver.user_role.UsersAndRolesService;
import ru.mycrg.wrapper.service.geoserver.workspace.WorkspacesService;

import java.io.IOException;

@Service
public class GeoServer implements IGeoServer {

    private final WorkspacesService workspacesService;
    private final UsersAndRolesService usersAndRolesService;
    private final RulesService rulesService;
    private final GisStorage gisStorage;
    private final StorageService storageService;

    @Autowired
    public GeoServer(WorkspacesService workspacesService, UsersAndRolesService usersAndRolesService,
                     RulesService rulesService, StorageService storageService, GisStorage gisStorage) {
        this.workspacesService = workspacesService;
        this.usersAndRolesService = usersAndRolesService;
        this.rulesService = rulesService;
        this.storageService = storageService;
        this.gisStorage = gisStorage;
    }

    public void createOrganization(Long id, String rawPassword) throws IOException, RuntimeException {
        String workspaceName = GeoServerConstants.DEFAULT_WORKSPACE_NAME + "_" + id;
        String userName = GeoServerConstants.DEFAULT_USER_NAME + id;
        String roleName = GeoServerConstants.DEFAULT_ROLE_NAME + "_" + id;
        String databaseName = GeoServerConstants.DEFAULT_DB_NAME + "_" + id;

        workspacesService.createWorkspace(workspaceName);
        usersAndRolesService.createRole(roleName);
        usersAndRolesService.createUser(userName, rawPassword);
        usersAndRolesService.associateUserWithRole(userName, roleName);
        rulesService.addLayersRule(GeoServerUtil.buildRule(workspaceName, GeoServerPermissions.ADMIN), roleName);
        rulesService.addRestRule(roleName);

        gisStorage.createDb("database_" + id);
        gisStorage.initP10Database("database_" + id, "public");

        storageService.createStorage(workspaceName, GeoServerConstants.DEFAULT_DATASTORE_NAME + "_" + id, databaseName);
    }

}
