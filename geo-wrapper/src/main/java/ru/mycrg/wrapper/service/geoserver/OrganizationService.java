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
import static ru.mycrg.wrapper.service.geoserver.GeoServerPermissions.ADMIN;
import static ru.mycrg.wrapper.service.geoserver.GeoServerPermissions.WRITE;
import static ru.mycrg.wrapper.service.geoserver.GeoServerUtil.buildRule;

/**
 * При создании БД для организации, использую ИД организации для генерации названия БД.
 * Затем при создании проектов пользуюсь этим.
 * Т.е. название БД для организации это "database_3" например.
 * А название схемы в БД более осмысленное - транслит в латиницу с русского названия проекта, это же используется для
 * именования рабочей области на геосервере.
 */
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
     * - создаем рабочую область и хранилище для временного импорта
     * - задаем роль и правило доступа к хранилищу "помойке" - scratch_workspace
     * - создаем пользователя на геосервере
     * - ассоциируем роль с пользователем
     * - создаем БД
     */
    public void createOrganization(OrgMqRequest dto) throws IOException, RuntimeException {
        String roleName = DEFAULT_ROLE_NAME + dto.getOrgId();
        String dbName = "database_" + dto.getOrgId();
        String scratchWorkspaceName = "scratch_" + dbName;

        // На геосервере создаем рабочую область и хранилище для временного импорта: "scratch"
        workspacesService.createWorkspace(scratchWorkspaceName);
        storageService.createStorage(dbName, "public", scratchWorkspaceName, scratchWorkspaceName + "_store");

        // Задаем правила доступа к рабочей области "scratch"
        rulesService.addLayersRule(buildRule(scratchWorkspaceName, ADMIN), DEFAULT_ROLE_NAME + dto.getOrgId());

        usersAndRolesService.createUser(dto.getEmail(), dto.getRawPassword());
        usersAndRolesService.createRole(roleName);
        rulesService.addRestRule(roleName);

        usersAndRolesService.associateUserWithRole(dto.getUserName(), roleName);

        // В БД
        gisStorage.createDb(dbName);
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

        // На геосервере создаем рабочую область и хранилище.
        workspacesService.createWorkspace(workspaceName);
        storageService.createStorage(databaseName, workspaceName, workspaceName, storeName);

        // Задаем правила доступа к рабочей области проекта
        rulesService.addLayersRule(buildRule(workspaceName, ADMIN), DEFAULT_ROLE_NAME + dto.getOrgId());
        // Задаю правило WRITE потому как не давало менять фичу через wfs
        rulesService.addLayersRule(buildRule(workspaceName, WRITE), DEFAULT_ROLE_NAME + dto.getOrgId());

        // В БД создаем схему и инициализируем в ней шаблонную структуру
        gisStorage.initP10Template(databaseName, workspaceName);
    }

}
