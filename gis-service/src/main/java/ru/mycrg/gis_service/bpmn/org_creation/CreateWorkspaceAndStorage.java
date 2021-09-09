package ru.mycrg.gis_service.bpmn.org_creation;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.storage.vector.ConnectionParameters;
import ru.mycrg.geoserver_client.services.storage.vector.DataStore;
import ru.mycrg.geoserver_client.services.storage.vector.VectorStorage;
import ru.mycrg.geoserver_client.services.workspace.WorkspacesService;
import ru.mycrg.gis_service.dto.geoserver.OrgCreateDto;

import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;
import static ru.mycrg.gis_service.bpmn.BPMNProcessVar.CREATE_DTO_VAR_NAME;
import static ru.mycrg.gis_service.bpmn.BPMNProcessVar.TOKEN_VAR_NAME;
import static ru.mycrg.common_utils.CrgGlobalProperties.*;

@Service("createWorkspaceAndStorage")
public class CreateWorkspaceAndStorage implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(CreateWorkspaceAndStorage.class);

    @Autowired
    private Environment environment;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final String accessToken = execution.getVariable(TOKEN_VAR_NAME.getValue()).toString();
        final String jsonString = (String) execution.getVariable(CREATE_DTO_VAR_NAME.getValue());
        OrgCreateDto dto = objectMapper.readValue(jsonString, OrgCreateDto.class);

        String dbName = getDefaultDatabaseName(dto.getOrgId());
        String scratchWorkspaceName = getScratchWorkspaceName(dbName);

        // На геосервере создаем рабочую область и хранилище для временного импорта: "scratch"
        new WorkspacesService(accessToken).createWorkspace(scratchWorkspaceName);

        log.debug("Try to create workspace and storage for org {}", dto.getOrgId());

        String postGis = environment
                .getRequiredProperty("spring.datasource.url")
                .split("//")[1]
                .split("/")[0];

        String dbHost = postGis.split(":")[0];
        int dbPort = Integer.parseInt(postGis.split(":")[1]);
        String dbOwner = environment.getRequiredProperty("spring.datasource.username");
        String dbPass = environment.getRequiredProperty("spring.datasource.password");

        ConnectionParameters connParams = new ConnectionParameters(dbHost, String.valueOf(dbPort), dbName, "public",
                                                                   dbOwner, dbPass, "postgis");

        DataStore dataStore = new DataStore(getDefaultStoreName(scratchWorkspaceName), connParams);

        new VectorStorage(accessToken).create(scratchWorkspaceName, dataStore);
    }
}
