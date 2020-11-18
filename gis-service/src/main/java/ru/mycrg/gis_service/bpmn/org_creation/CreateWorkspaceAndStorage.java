package ru.mycrg.gis_service.bpmn.org_creation;

import lombok.extern.log4j.Log4j2;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.storage.vector.VectorStorage;
import ru.mycrg.geoserver_client.services.workspace.WorkspacesService;
import ru.mycrg.gis_service.dto.geoserver.OrgCreateDto;

import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;
import static ru.mycrg.gis_service.bpmn.IJavaDelegateProperties.CREATE_DTO_VAR_NAME;
import static ru.mycrg.gis_service.bpmn.IJavaDelegateProperties.TOKEN_VAR_NAME;
import static ru.mycrg.mq_queue_contract.CrgConstants.*;

@Log4j2
@Service("createWorkspaceAndStorage")
public class CreateWorkspaceAndStorage implements JavaDelegate {

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final String accessToken = execution.getVariable(TOKEN_VAR_NAME).toString();
        final String jsonString = (String) execution.getVariable(CREATE_DTO_VAR_NAME);
        OrgCreateDto dto = objectMapper.readValue(jsonString, OrgCreateDto.class);

        String dbName = DEFAULT_DB_NAME + dto.getOrgId();
        String scratchWorkspaceName = SCRATCH_DB_PREFIX + dbName;

        // На геосервере создаем рабочую область и хранилище для временного импорта: "scratch"
        new WorkspacesService(accessToken)
                .createWorkspace(scratchWorkspaceName);
        new VectorStorage(accessToken)
                .create(dbName, "public", scratchWorkspaceName, scratchWorkspaceName + DEFAULT_STORE_POSTFIX);
    }
}
