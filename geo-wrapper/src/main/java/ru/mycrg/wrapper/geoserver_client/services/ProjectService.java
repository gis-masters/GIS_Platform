package ru.mycrg.wrapper.geoserver_client.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.wrapper.geoserver_client.GeoserverClientException;
import ru.mycrg.wrapper.geoserver_client.rule.RulesService;
import ru.mycrg.wrapper.geoserver_client.storage.StorageService;
import ru.mycrg.wrapper.geoserver_client.workspace.WorkspacesService;

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

    @Autowired
    public ProjectService(WorkspacesService workspacesService,
                          RulesService rulesService,
                          StorageService storageService) {
        this.workspacesService = workspacesService;
        this.rulesService = rulesService;
        this.storageService = storageService;
    }

    /**
     * Создание проекта.
     * Создание хранилища (postgis) на геосервере.
     */
    @Override
    public void createProject(String projectName, Long orgId) throws GeoserverClientException {
        try {
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

    @Override
    public void deleteProject(String projectName) {
        log.info("Try delete project: {}", projectName);
    }
}
