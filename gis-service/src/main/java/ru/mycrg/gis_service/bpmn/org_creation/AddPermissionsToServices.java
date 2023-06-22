package ru.mycrg.gis_service.bpmn.org_creation;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.rule.RulesService;
import ru.mycrg.gis_service.dto.geoserver.OrgCreateDto;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultRoleName;
import static ru.mycrg.geoserver_client.services.rule.ServiceKeys.WFS_RULE_KEY;
import static ru.mycrg.geoserver_client.services.rule.ServiceKeys.WMS_RULE_KEY;
import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;
import static ru.mycrg.gis_service.bpmn.BpmnProcessVar.CREATE_DTO_VAR_NAME;
import static ru.mycrg.gis_service.bpmn.BpmnProcessVar.TOKEN_VAR_NAME;

@Service("addPermissionsToServices")
public class AddPermissionsToServices implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(AddPermissionsToServices.class);

    @Override
    public void execute(DelegateExecution execution) {
        try {
            String accessToken = execution.getVariable(TOKEN_VAR_NAME.getValue()).toString();
            String jsonString = (String) execution.getVariable(CREATE_DTO_VAR_NAME.getValue());
            OrgCreateDto dto = objectMapper.readValue(jsonString, OrgCreateDto.class);
            Long orgId = dto.getOrgId();
            String roleName = getDefaultRoleName(orgId);

            log.debug("Try add permissions to services: {}", orgId);

            RulesService rulesService = new RulesService(accessToken);

            rulesService.addServiceRule(WMS_RULE_KEY, roleName);
            rulesService.addServiceRule(WFS_RULE_KEY, roleName);
        } catch (Exception e) {
            log.error("Failed to execute addPermissionsToServices step. Reason: {}", e.getMessage());
        }
    }
}
