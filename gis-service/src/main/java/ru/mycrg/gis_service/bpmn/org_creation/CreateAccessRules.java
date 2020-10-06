package ru.mycrg.gis_service.bpmn.org_creation;

import lombok.extern.log4j.Log4j2;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.rule.RulesService;
import ru.mycrg.gis_service.dto.geoserver.OrgCreateDto;

import static ru.mycrg.geoserver_client.services.rule.GeoServerPermissions.*;
import static ru.mycrg.geoserver_client.services.rule.RulesUtil.buildRule;
import static ru.mycrg.geoserver_client.services.rule.ServiceKeys.WFS_RULE_KEY;
import static ru.mycrg.geoserver_client.services.rule.ServiceKeys.WMS_RULE_KEY;
import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;
import static ru.mycrg.gis_service.bpmn.IJavaDelegateProperties.CREATE_DTO_VAR_NAME;
import static ru.mycrg.gis_service.bpmn.IJavaDelegateProperties.TOKEN_VAR_NAME;
import static ru.mycrg.mq_queue_contract.CrgConstants.*;

@Log4j2
@Service("createAccessRules")
public class CreateAccessRules implements JavaDelegate {

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final String accessToken = execution.getVariable(TOKEN_VAR_NAME).toString();
        final String jsonString = (String) execution.getVariable(CREATE_DTO_VAR_NAME);
        OrgCreateDto dto = objectMapper.readValue(jsonString, OrgCreateDto.class);

        RulesService rulesService = new RulesService(accessToken);

        String roleName = DEFAULT_ROLE_NAME + dto.getOrgId();
        String dbName = DEFAULT_DB_NAME + dto.getOrgId();
        String scratchWorkspaceName = SCRATCH_DB_PREFIX + dbName;

        // Задаем правила доступа к рабочей области "scratch"
        rulesService.addLayersRule(buildRule(scratchWorkspaceName, ADMIN), DEFAULT_ROLE_NAME + dto.getOrgId());
        rulesService.addLayersRule(buildRule(scratchWorkspaceName, WRITE), DEFAULT_ROLE_NAME + dto.getOrgId());
        rulesService.addLayersRule(buildRule(scratchWorkspaceName, READ), DEFAULT_ROLE_NAME + dto.getOrgId());
        rulesService.addRestRule(roleName);
        rulesService.addServiceRule(WMS_RULE_KEY, roleName);
        rulesService.addServiceRule(WFS_RULE_KEY, roleName);
    }
}
