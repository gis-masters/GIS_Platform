package ru.mycrg.wrapper.service.geoserver;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.MqOrganizationInit;
import ru.mycrg.wrapper.dao.GisStorage;
import ru.mycrg.wrapper.service.geoserver.rule.RulesService;
import ru.mycrg.wrapper.service.geoserver.storage.StorageService;
import ru.mycrg.wrapper.service.geoserver.user_role.UsersAndRolesService;
import ru.mycrg.wrapper.service.geoserver.workspace.WorkspacesService;

import java.io.IOException;

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
     * <p>
     * Подразумевает под собой:
     *   <p> - Создание БД в postGis<br>
     */
    public void createOrganization(MqOrganizationInit orgData) throws IOException, RuntimeException {
        gisStorage.createDb("database_" + orgData.getId());
    }

    /**
     * Создание проекта.
     * <p>
     * Подразумевает под собой:
     *   <p> - Создание рабочей области, роли, супер-пользователя с необходимыми ролями.<p>
     *         Добавление правил доступа к:<br>
     *             * рабочей области или слоям рабочей области.<br>
     *             * REST геосервера<br><br>
     *   <p> - Создание хранилища (postgis) на геосервере.
     */
    public void createProject(MqOrganizationInit orgData) throws IOException, RuntimeException {
        Long id = orgData.getId();
        String rawPassword = orgData.getRawPassword();

        String workspaceName = GeoServerConstants.DEFAULT_WORKSPACE_NAME + "_" + id;
        String userName = orgData.getEmail();
        String roleName = GeoServerConstants.DEFAULT_ROLE_NAME + "_" + id;
        String databaseName = GeoServerConstants.DEFAULT_DB_NAME + "_" + id;

        workspacesService.createWorkspace(workspaceName);
        usersAndRolesService.createRole(roleName);
        usersAndRolesService.createUser(userName, rawPassword);
        usersAndRolesService.associateUserWithRole(userName, roleName);
        rulesService.addLayersRule(GeoServerUtil.buildRule(workspaceName, GeoServerPermissions.ADMIN), roleName);
        rulesService.addRestRule(roleName);

        gisStorage.initP10Database("database_" + id, "public");

        storageService.createStorage(workspaceName, GeoServerConstants.DEFAULT_DATASTORE_NAME + "_" + id, databaseName);
    }

}
