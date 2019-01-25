package ru.mycrg.wrapper.service.geoserver;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.wrapper.dao.PostGisStorage;
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

        postGisStorage.createDb("database_" + id);

        storageService.createStorage(workspaceName, GeoServerConstants.DEFAULT_DATASTORE_NAME + "_" + id, databaseName);
    }

}
