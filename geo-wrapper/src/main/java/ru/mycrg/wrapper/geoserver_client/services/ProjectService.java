package ru.mycrg.wrapper.geoserver_client.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.OrgMqProcessRequest;
import ru.mycrg.wrapper.geoserver_client.rule.RulesService;
import ru.mycrg.wrapper.geoserver_client.storage.StorageService;
import ru.mycrg.wrapper.geoserver_client.workspace.WorkspacesService;

import java.io.IOException;
import java.sql.SQLException;

import static ru.mycrg.common.CrgConstants.*;
import static ru.mycrg.wrapper.geoserver_client.GeoServerPermissions.ADMIN;
import static ru.mycrg.wrapper.geoserver_client.GeoServerPermissions.WRITE;
import static ru.mycrg.wrapper.geoserver_client.GeoServerUtil.buildRule;

@Service
public class ProjectService {

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
    public void createProject(OrgMqProcessRequest dto) throws IOException, RuntimeException, SQLException {
        String projectName = dto.getProjectName();
        String databaseName = DEFAULT_DB_NAME + dto.getOrgId();
        String storeName = databaseName + DEFAULT_STORE_POSTFIX;

        // На геосервере создаем рабочую область и хранилище.
        workspacesService.createWorkspace(projectName);
        storageService.createStorage(databaseName, projectName, projectName, storeName);

        // Задаем правила доступа к рабочей области проекта
        rulesService.addLayersRule(buildRule(projectName, ADMIN), DEFAULT_ROLE_NAME + dto.getOrgId());
        // Задаю правило WRITE потому как не давало менять фичу через wfs
        rulesService.addLayersRule(buildRule(projectName, WRITE), DEFAULT_ROLE_NAME + dto.getOrgId());
    }

    public void deleteProject(OrgMqProcessRequest request) {
        log.info("Try delete project: {}", request.getProjectName());
    }
}
