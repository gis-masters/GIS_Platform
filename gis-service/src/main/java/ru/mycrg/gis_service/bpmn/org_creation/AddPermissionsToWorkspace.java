package ru.mycrg.gis_service.bpmn.org_creation;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.rule.RulesService;
import ru.mycrg.gis_service.dto.geoserver.OrgCreateDto;

import java.util.UUID;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultRoleName;
import static ru.mycrg.common_utils.CrgGlobalProperties.getScratchWorkspaceName;
import static ru.mycrg.geoserver_client.services.rule.GeoServerPermissions.*;
import static ru.mycrg.geoserver_client.services.rule.RulesUtil.buildRule;
import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;
import static ru.mycrg.gis_service.bpmn.BpmnProcessVar.*;

@Service("addPermissionsToWorkspace")
public class AddPermissionsToWorkspace implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(AddPermissionsToWorkspace.class);

    @Override
    public void execute(DelegateExecution execution) {
        try {
            String accessToken = execution.getVariable(TOKEN_VAR_NAME.getValue()).toString();
            String jsonString = (String) execution.getVariable(CREATE_DTO_VAR_NAME.getValue());
            OrgCreateDto dto = objectMapper.readValue(jsonString, OrgCreateDto.class);
            Long orgId = dto.getOrgId();

            String roleName = getDefaultRoleName(orgId);
            String scratchWorkspaceName = getScratchWorkspaceName(orgId);

            log.debug("Try add permissions to workspace: {}", scratchWorkspaceName);

            RulesService rulesService = new RulesService(accessToken);

            rulesService.addLayersRule(buildRule(scratchWorkspaceName, ADMIN), roleName);
            rulesService.addLayersRule(buildRule(scratchWorkspaceName, WRITE), roleName);
            rulesService.addLayersRule(buildRule(scratchWorkspaceName, READ), roleName);

            execution.setVariable(PROCESS_ID_VAR_NAME.getValue(), orgId + "_" + roleName);
            execution.setVariable(ITERATION_COUNTER_VAR_NAME.getValue(), 1);
        } catch (Exception e) {
            log.error("Failed to execute addPermissionsToWorkspace step. Reason: {}", e.getMessage());
        }
    }
}
