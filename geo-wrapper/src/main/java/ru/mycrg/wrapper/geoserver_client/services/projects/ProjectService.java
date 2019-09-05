package ru.mycrg.wrapper.geoserver_client.services.projects;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.wrapper.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.wrapper.geoserver_client.services.rule.RulesService;
import ru.mycrg.wrapper.geoserver_client.services.AuthService;
import ru.mycrg.wrapper.geoserver_client.services.storage.StorageService;
import ru.mycrg.wrapper.geoserver_client.services.workspace.WorkspacesService;

import static ru.mycrg.common.CrgConstants.*;
import static ru.mycrg.wrapper.geoserver_client.GeoServerPermissions.ADMIN;
import static ru.mycrg.wrapper.geoserver_client.GeoServerPermissions.WRITE;
import static ru.mycrg.wrapper.geoserver_client.GeoServerUtil.buildRule;

@Service
public class ProjectService implements IProject {

    private static final Logger log = LoggerFactory.getLogger(ProjectService.class);

    private final WorkspacesService workspacesService;
    private final RulesService rulesService;
    private final StorageService storageService;
    private final AuthService authService;

    @Autowired
    public ProjectService(WorkspacesService workspacesService,
                          RulesService rulesService,
                          AuthService authService,
                          StorageService storageService) {
        this.workspacesService = workspacesService;
        this.rulesService = rulesService;
        this.storageService = storageService;
        this.authService = authService;
    }

    /**
     * Создание проекта.
     * Создание хранилища (postgis) на геосервере.
     */
    @Override
    public void createProject(String projectName, Long orgId) throws GeoserverClientException {
        try {
            log.debug("Try create project: {}", projectName);

            authService.authorize();

            String databaseName = DEFAULT_DB_NAME + orgId;
            String storeName = databaseName + DEFAULT_STORE_POSTFIX;

            // На геосервере создаем рабочую область и хранилище.
            workspacesService.createWorkspace(projectName);
            storageService.createStorage(databaseName, projectName, projectName, storeName);

            // Задаем правила доступа к рабочей области проекта
            rulesService.addLayersRule(buildRule(projectName, ADMIN), DEFAULT_ROLE_NAME + orgId);
            // Задаю правило WRITE потому как не давало менять фичу через wfs
            rulesService.addLayersRule(buildRule(projectName, WRITE), DEFAULT_ROLE_NAME + orgId);
        } catch (Exception e) {
            throw new GeoserverClientException(e.getMessage(), e);
        }
    }

    /**
     * При удалении проекта на геосервере удаляем проект, в режиме "recurse": delete workspace contents.
     *
     * @param projectName Нзвание проекта
     * @throws GeoserverClientException
     */
    @Override
    public void deleteProject(@NotNull String projectName) throws GeoserverClientException {
        try {
            log.info("Try delete project: {}", projectName);

            authService.authorize();

            workspacesService.deleteWorkspace(projectName);
        } catch (Exception e) {
            throw new GeoserverClientException(e.getMessage(), e);
        }
    }
}
