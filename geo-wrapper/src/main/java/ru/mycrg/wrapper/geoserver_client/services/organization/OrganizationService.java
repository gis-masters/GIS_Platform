package ru.mycrg.wrapper.geoserver_client.services.organization;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.OrgMqProcessRequest;
import ru.mycrg.common.crypt.AES;
import ru.mycrg.wrapper.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.wrapper.geoserver_client.services.rule.RulesService;
import ru.mycrg.wrapper.geoserver_client.services.AuthService;
import ru.mycrg.wrapper.geoserver_client.services.storage.StorageService;
import ru.mycrg.wrapper.geoserver_client.services.user_role.UsersAndRolesService;
import ru.mycrg.wrapper.geoserver_client.services.workspace.WorkspacesService;

import static ru.mycrg.common.CrgConstants.DEFAULT_DB_NAME;
import static ru.mycrg.common.CrgConstants.DEFAULT_ROLE_NAME;
import static ru.mycrg.wrapper.geoserver_client.GeoServerPermissions.ADMIN;
import static ru.mycrg.wrapper.geoserver_client.GeoServerUtil.buildRule;

/**
 * При создании БД для организации, использую ИД организации для генерации названия БД.
 * Затем при создании проектов пользуюсь этим.
 * Т.е. название БД для организации это "database_3" например.
 * А название схемы в БД более осмысленное - транслит в латиницу с русского названия проекта, это же используется для
 * именования рабочей области на геосервере.
 */
@Service
public class OrganizationService implements IOrganization {

    private static final Logger log = LoggerFactory.getLogger(OrganizationService.class);

    private final WorkspacesService workspacesService;
    private final UsersAndRolesService usersAndRolesService;
    private final RulesService rulesService;
    private final StorageService storageService;
    private final AuthService authService;

    @Autowired
    public OrganizationService(WorkspacesService workspacesService,
                               UsersAndRolesService usersAndRolesService,
                               RulesService rulesService,
                               AuthService authService,
                               StorageService storageService) {
        this.workspacesService = workspacesService;
        this.usersAndRolesService = usersAndRolesService;
        this.rulesService = rulesService;
        this.authService = authService;
        this.storageService = storageService;
    }

    /**
     * Создание организации.
     * На геосревере нет понятия организация. Мы же под организацией понимаем заведение на геосервере новой
     * учетки пользователя, который сможет создавать свои проекты - workspaces.
     * - создаем рабочую область и хранилище для временного импорта
     * - задаем роль и правило доступа к хранилищу "помойке" - scratch_workspace
     * - ассоциируем роль с пользователем
     */
    @Override
    public void create(OrgMqProcessRequest dto) throws GeoserverClientException {
        log.debug("Create organization on geoserver: {}", dto.getOrgId());

        try {
            authService.authorize();

            String roleName = DEFAULT_ROLE_NAME + dto.getOrgId();
            String dbName = DEFAULT_DB_NAME + dto.getOrgId();
            String scratchWorkspaceName = "scratch_" + dbName;

            // На геосервере создаем рабочую область и хранилище для временного импорта: "scratch"
            workspacesService.createWorkspace(scratchWorkspaceName);
            storageService.createStorage(dbName, "public", scratchWorkspaceName, scratchWorkspaceName + "_store");

            // Задаем правила доступа к рабочей области "scratch"
            rulesService.addLayersRule(buildRule(scratchWorkspaceName, ADMIN), DEFAULT_ROLE_NAME + dto.getOrgId());

            String rawPassword = AES.decrypt(dto.getRawPassword(), dto.getEmail());
            usersAndRolesService.createUser(dto.getEmail(), rawPassword);
            usersAndRolesService.createRole(roleName);
            rulesService.addRestRule(roleName);

            usersAndRolesService.associateUserWithRole(dto.getUserName(), roleName);
        } catch (Exception e) {
            throw new GeoserverClientException(e.getMessage(), e);
        }
    }

}
