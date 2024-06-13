package ru.mycrg.gis_service.bpmn.org_creation;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.rule.RulesService;
import ru.mycrg.gis_service.dto.geoserver.OrgCreateDto;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultRoleName;
import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;
import static ru.mycrg.gis_service.bpmn.BpmnProcessVar.CREATE_DTO_VAR_NAME;
import static ru.mycrg.gis_service.bpmn.BpmnProcessVar.TOKEN_VAR_NAME;

@Service("addPermissionsToRest")
public class AddPermissionsToRest implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(AddPermissionsToRest.class);

    @Override
    public void execute(DelegateExecution execution) {
        try {
            String accessToken = execution.getVariable(TOKEN_VAR_NAME.getValue()).toString();
            String jsonString = (String) execution.getVariable(CREATE_DTO_VAR_NAME.getValue());
            OrgCreateDto dto = objectMapper.readValue(jsonString, OrgCreateDto.class);
            Long orgId = dto.getOrgId();
            String roleName = getDefaultRoleName(orgId);

            log.debug("Try ADD role: '{}' to REST", roleName);

            new RulesService(accessToken).addRestRule(roleName);
        } catch (Exception e) {
            log.error("Failed to execute addPermissionsToRest step. Reason: {}", e.getMessage());
        }
    }
}
