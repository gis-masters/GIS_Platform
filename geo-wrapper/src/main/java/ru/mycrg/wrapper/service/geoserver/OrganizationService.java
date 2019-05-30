package ru.mycrg.wrapper.service.geoserver;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.OrgMqProcessRequest;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.service.geoserver.rule.RulesService;
import ru.mycrg.wrapper.service.geoserver.storage.StorageService;
import ru.mycrg.wrapper.service.geoserver.user_role.UsersAndRolesService;
import ru.mycrg.wrapper.service.geoserver.workspace.WorkspacesService;

import java.io.IOException;

import static ru.mycrg.wrapper.service.geoserver.GeoServerConstants.DEFAULT_ROLE_NAME;
import static ru.mycrg.wrapper.service.geoserver.GeoServerPermissions.ADMIN;
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

    private static final Logger log = LoggerFactory.getLogger(OrganizationService.class);

    private final WorkspacesService workspacesService;
    private final UsersAndRolesService usersAndRolesService;
    private final RulesService rulesService;
    private final BaseDaoService baseDaoService;
    private final StorageService storageService;

    @Autowired
    public OrganizationService(WorkspacesService workspacesService, UsersAndRolesService usersAndRolesService,
                               RulesService rulesService, StorageService storageService, BaseDaoService baseDaoService) {
        this.workspacesService = workspacesService;
        this.usersAndRolesService = usersAndRolesService;
        this.rulesService = rulesService;
        this.storageService = storageService;
        this.baseDaoService = baseDaoService;
    }

    /**
     * Создание организации.
     * - создаем рабочую область и хранилище для временного импорта
     * - задаем роль и правило доступа к хранилищу "помойке" - scratch_workspace
     * - создаем пользователя на геосервере
     * - ассоциируем роль с пользователем
     * - создаем БД
     */
    public void createOrganization(OrgMqProcessRequest dto) throws IOException, RuntimeException {
        log.debug("Create organization on geoserver: {}", dto.getOrgId());

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
        baseDaoService.createDb(dbName);
    }

}
