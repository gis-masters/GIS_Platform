package ru.mycrg.gis_service.bpmn.org_deletion;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.workspace.WorkspacesService;

import java.util.List;

import static ru.mycrg.gis_service.bpmn.BpmnProcessVar.TOKEN_VAR_NAME;
import static ru.mycrg.gis_service.bpmn.BpmnProcessVar.WORKSPACES_VAR_NAME;

@Service("deleteWorkspaceAndStorage")
public class DeleteWorkspaceAndStorage implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(DeleteWorkspaceAndStorage.class);

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final String accessToken = execution.getVariable(TOKEN_VAR_NAME.getValue()).toString();
        List<String> workspaces = (List<String>) execution.getVariable(WORKSPACES_VAR_NAME.getValue());

        final WorkspacesService workspacesService = new WorkspacesService(accessToken);
        for (String workspaceName: workspaces) {
            log.debug("try delete workspaceName: {}", workspaceName);

            workspacesService.deleteWorkspace(workspaceName);
        }
    }
}
