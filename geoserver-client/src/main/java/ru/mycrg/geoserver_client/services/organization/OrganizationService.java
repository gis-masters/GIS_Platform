package ru.mycrg.geoserver_client.services.organization;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.auth_service_contract.OrganizationInitializedEvent;
import ru.mycrg.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.geoserver_client.services.rule.RulesService;
import ru.mycrg.geoserver_client.services.storage.StorageService;
import ru.mycrg.geoserver_client.services.user_role.UsersAndRolesService;
import ru.mycrg.geoserver_client.services.workspace.WorkspacesService;

import static ru.mycrg.geoserver_client.services.rule.GeoServerPermissions.*;
import static ru.mycrg.geoserver_client.services.rule.RulesUtil.buildRule;
import static ru.mycrg.geoserver_client.services.rule.ServiceKeys.WFS_RULE_KEY;
import static ru.mycrg.geoserver_client.services.rule.ServiceKeys.WMS_RULE_KEY;
import static ru.mycrg.mq_queue_contract.CrgConstants.*;

/**
 * При создании БД для организации, использую ИД организации для генерации названия БД.
 * Затем при создании проектов пользуюсь этим.
 * Т.е. название БД для организации это "database_3" например.
 * А название схемы в БД более осмысленное - транслит в латиницу с русского названия проекта, это же используется для
 * именования рабочей области на геосервере.
 */
public class OrganizationService implements IOrganization {

    private static final Logger log = LoggerFactory.getLogger(OrganizationService.class);

    private final WorkspacesService workspacesService;
    private final UsersAndRolesService usersAndRolesService;
    private final RulesService rulesService;
    private final StorageService storageService;

    public OrganizationService() {
        this.workspacesService = new WorkspacesService();
        this.usersAndRolesService = new UsersAndRolesService();
        this.rulesService = new RulesService();
        this.storageService = new StorageService();
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
    public void create(OrganizationInitializedEvent dto) throws GeoserverClientException {
        log.debug("Create organization on geoserver: {}", dto.getOrgId());

        try {
            String roleName = DEFAULT_ROLE_NAME + dto.getOrgId();
            String dbName = DEFAULT_DB_NAME + dto.getOrgId();
            String scratchWorkspaceName = SCRATCH_DB_PREFIX + dbName;

            // На геосервере создаем рабочую область и хранилище для временного импорта: "scratch"
            workspacesService.createWorkspace(scratchWorkspaceName);
            storageService.createStorage(dbName, "public", scratchWorkspaceName, scratchWorkspaceName + DEFAULT_STORE_POSTFIX);

            // Задаем правила доступа к рабочей области "scratch"
            rulesService.addLayersRule(buildRule(scratchWorkspaceName, ADMIN), DEFAULT_ROLE_NAME + dto.getOrgId());
            rulesService.addLayersRule(buildRule(scratchWorkspaceName, WRITE), DEFAULT_ROLE_NAME + dto.getOrgId());
            rulesService.addLayersRule(buildRule(scratchWorkspaceName, READ), DEFAULT_ROLE_NAME + dto.getOrgId());

            String rawPassword = AES.decrypt(dto.getOwnerRawPassword(), dto.getOwnerEmail());
            usersAndRolesService.createUser(dto.getOwnerEmail(), rawPassword);
            usersAndRolesService.createRole(roleName);
            rulesService.addRestRule(roleName);
            rulesService.addServiceRule(WMS_RULE_KEY, roleName);
            rulesService.addServiceRule(WFS_RULE_KEY, roleName);

            usersAndRolesService.associateUserWithRole(dto.getOwnerUserName(), roleName);
        } catch (Exception e) {
            throw new GeoserverClientException(e.getMessage(), e);
        }
    }

}
