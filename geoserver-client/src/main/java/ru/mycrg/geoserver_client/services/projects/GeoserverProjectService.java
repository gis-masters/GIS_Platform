package ru.mycrg.geoserver_client.services.projects;

import org.jetbrains.annotations.NotNull;
import ru.mycrg.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.geoserver_client.services.rule.RulesService;
import ru.mycrg.geoserver_client.services.workspace.WorkspacesService;

import static ru.mycrg.geoserver_client.services.rule.GeoServerPermissions.*;
import static ru.mycrg.geoserver_client.services.rule.RulesUtil.buildRule;
import static ru.mycrg.mq_queue_contract.CrgConstants.DEFAULT_ROLE_NAME;

public class GeoserverProjectService implements IProject {

    private final WorkspacesService workspacesService;
    private final RulesService rulesService;

    public GeoserverProjectService(String accessToken) {
        this.workspacesService = new WorkspacesService(accessToken);
        this.rulesService = new RulesService(accessToken);
    }

    /**
     * <p>Создание проекта.</p>
     *
     * Под проектом на геосервере пониматся создание новой рабочей области.
     * А так же выставление прав доступа к рабочей области, для админа данной организации.
     */
    @Override
    public void createProject(String projectName, Long orgId) throws GeoserverClientException {
        try {
            // На геосервере создаем рабочую область и хранилище.
            workspacesService.createWorkspace(projectName);

            // Задаем правила доступа к рабочей области проекта
            rulesService.addLayersRule(buildRule(projectName, ADMIN), DEFAULT_ROLE_NAME + orgId);
            // Задаю правило WRITE потому как не давало менять фичу через wfs
            rulesService.addLayersRule(buildRule(projectName, WRITE), DEFAULT_ROLE_NAME + orgId);
            // Если не задано правило на чтение, то, по-умолчанию, рабочая область видна всем.
            // Azure workItem: 777 Add roles with anonymous
            rulesService.addLayersRule(buildRule(projectName, READ), DEFAULT_ROLE_NAME + orgId + ",ROLE_ANONYMOUS");
        } catch (Exception e) {
            throw new GeoserverClientException(e.getMessage(), e);
        }
    }

    /**
     * При удалении проекта на геосервере удаляем рабочую область, в режиме "recurse": подразумевает удаление контента
     * связанного с этой рабочей областью.
     *
     * @param projectName Нзвание проекта
     */
    @Override
    public void deleteProject(@NotNull String projectName) throws GeoserverClientException {
        try {
            workspacesService.deleteWorkspace(projectName);
        } catch (Exception e) {
            throw new GeoserverClientException(e.getMessage(), e);
        }
    }
}
