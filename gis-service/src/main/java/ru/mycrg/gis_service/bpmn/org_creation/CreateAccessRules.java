package ru.mycrg.gis_service.bpmn.org_creation;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.rule.RulesService;
import ru.mycrg.gis_service.dto.geoserver.OrgCreateDto;

import static ru.mycrg.geoserver_client.services.rule.GeoServerPermissions.*;
import static ru.mycrg.geoserver_client.services.rule.RulesUtil.buildRule;
import static ru.mycrg.geoserver_client.services.rule.ServiceKeys.WFS_RULE_KEY;
import static ru.mycrg.geoserver_client.services.rule.ServiceKeys.WMS_RULE_KEY;
import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;
import static ru.mycrg.gis_service.bpmn.BPMNProcessVar.CREATE_DTO_VAR_NAME;
import static ru.mycrg.gis_service.bpmn.BPMNProcessVar.TOKEN_VAR_NAME;
import static ru.mycrg.mq_queue_contract.CrgConstants.*;

@Service("createAccessRules")
public class CreateAccessRules implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(CreateAccessRules.class);

    @Override
    public void execute(DelegateExecution execution) throws Exception {

        final String accessToken = execution.getVariable(TOKEN_VAR_NAME.getValue()).toString();
        final String jsonString = (String) execution.getVariable(CREATE_DTO_VAR_NAME.getValue());
        OrgCreateDto dto = objectMapper.readValue(jsonString, OrgCreateDto.class);

        log.debug("Try to add rules to org {}", dto.getOrgId());

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
