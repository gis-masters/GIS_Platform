package ru.mycrg.gis_service.bpmn.org_deletion;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.rule.RulesService;

import java.util.List;

import static ru.mycrg.gis_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.mq_queue_contract.CrgConstants.DEFAULT_ROLE_NAME;

@Service("deleteRules")
public class DeleteRules implements JavaDelegate {

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final Object orgId = execution.getVariable(ORG_ID_VAR_NAME);
        final String accessToken = execution.getVariable(TOKEN_VAR_NAME).toString();
        List<String> workspaces = (List<String>) execution.getVariable(WORKSPACES_VAR_NAME);

        final RulesService rulesService = new RulesService(accessToken);
        for (String workspaceName: workspaces) {
            rulesService.deleteResourceRule(workspaceName);
        }

        rulesService.deleteRestRule(DEFAULT_ROLE_NAME + orgId);
        rulesService.deleteServiceRule(DEFAULT_ROLE_NAME + orgId);
    }
}
