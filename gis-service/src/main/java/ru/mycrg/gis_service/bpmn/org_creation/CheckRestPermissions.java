package ru.mycrg.gis_service.bpmn.org_creation;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.rule.RulesService;
import ru.mycrg.gis_service.dto.geoserver.OrgCreateDto;
import ru.mycrg.http_client.ResponseModel;

import java.util.HashMap;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultRoleName;
import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;
import static ru.mycrg.gis_service.bpmn.BpmnProcessOptions.REPEAT_LIMIT;
import static ru.mycrg.gis_service.bpmn.BpmnProcessVar.*;

@Service("checkRestPermissions")
public class CheckRestPermissions implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(CheckRestPermissions.class);

    @Override
    public void execute(DelegateExecution execution) {
        String processId = (String) execution.getVariable(PROCESS_ID_VAR_NAME.getValue());
        int currentIteration = Integer.parseInt(execution.getVariable(ITERATION_COUNTER_VAR_NAME.getValue()).toString());
        if (currentIteration > REPEAT_LIMIT || processId == null) {
            execution.setVariable(CHECK_STATUS_VAR_NAME.getValue(), "FAILED");
        } else {
            try {
                String accessToken = execution.getVariable(TOKEN_VAR_NAME.getValue()).toString();
                String jsonString = (String) execution.getVariable(CREATE_DTO_VAR_NAME.getValue());
                OrgCreateDto dto = objectMapper.readValue(jsonString, OrgCreateDto.class);
                Long orgId = dto.getOrgId();
                String roleName = getDefaultRoleName(orgId);

                log.debug("processId: '{}'. CHECK role: '{}' for REST, currentIteration: {}",
                          processId, roleName, currentIteration);

                ResponseModel<HashMap> response = new RulesService(accessToken).getRestRules();
                if (response.isSuccessful()) {
                    HashMap body = response.getBody();
                    log.info("'{}' REST rules body: {}", roleName, body);

                    boolean containsInGet = body.get("/**:GET").toString().contains(roleName);
                        boolean containsInEdit = body.get("/**:POST,DELETE,PUT").toString().contains(roleName);
                    if (containsInGet && containsInEdit) {
                        log.info("roleName: '{}' EXIST in: {}", roleName, body);

                        execution.setVariable(CHECK_STATUS_VAR_NAME.getValue(), "SUCCESS");
                    } else {
                        log.info("roleName: '{}' NOT exist in: {}", roleName, body);

                        repeat(execution, currentIteration);
                    }
                } else {
                    repeat(execution, currentIteration);
                }
            } catch (Exception e) {
                log.error("Failed to execute addPermissionsToRest step. Reason: {}", e.getMessage());

                repeat(execution, currentIteration);
            }
        }
    }

    private static void repeat(DelegateExecution execution, int currentIteration) {
        execution.setVariable(CHECK_STATUS_VAR_NAME.getValue(), "REPEAT");
        execution.setVariable(ITERATION_COUNTER_VAR_NAME.getValue(), currentIteration + 1);
    }
}
