package ru.geoserver.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.geoserver.dao.PostGisStorage;
import ru.geoserver.service.rule.RulesService;
import ru.geoserver.service.storage.StorageService;
import ru.geoserver.service.user_role.UsersAndRolesService;
import ru.geoserver.service.workspace.WorkspacesService;

import java.io.IOException;

import static ru.geoserver.service.GeoServerConstants.*;

@Service
public class GeoServer implements IGeoServer {

    private final WorkspacesService workspacesService;
    private final UsersAndRolesService usersAndRolesService;
    private final RulesService rulesService;
    private final PostGisStorage postGisStorage;
    private final StorageService storageService;

    @Autowired
    public GeoServer(WorkspacesService workspacesService, UsersAndRolesService usersAndRolesService,
                     RulesService rulesService, StorageService storageService, PostGisStorage postGisStorage) {
        this.workspacesService = workspacesService;
        this.usersAndRolesService = usersAndRolesService;
        this.rulesService = rulesService;
        this.storageService = storageService;
        this.postGisStorage = postGisStorage;
    }

    public void createOrganization(Long id, String rawPassword) throws IOException, RuntimeException {
        String workspaceName = DEFAULT_WORKSPACE_NAME + "_" + id;
        String userName = DEFAULT_USER_NAME + id;
        String roleName = DEFAULT_ROLE_NAME + "_" + id;
        String databaseName = DEFAULT_DB_NAME + "_" + id;

        workspacesService.createWorkspace(workspaceName);
        usersAndRolesService.createRole(roleName);
        usersAndRolesService.createUser(userName, rawPassword);
        usersAndRolesService.associateUserWithRole(userName, roleName);
        rulesService.addRule(GeoServerUtil.buildRule(workspaceName, GeoServerPermissions.ADMIN), roleName);

        postGisStorage.createDb("database_" + id);

        storageService.createStorage(workspaceName,DEFAULT_DATASTORE_NAME + "_" + id, databaseName);
    }

}
