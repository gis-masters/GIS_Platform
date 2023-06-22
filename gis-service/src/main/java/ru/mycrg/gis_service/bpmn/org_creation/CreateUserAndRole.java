package ru.mycrg.gis_service.bpmn.org_creation;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.AESCryptor;
import ru.mycrg.geoserver_client.services.user_role.UsersAndRolesService;
import ru.mycrg.gis_service.dto.geoserver.OrgCreateDto;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultRoleName;
import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;
import static ru.mycrg.gis_service.bpmn.BpmnProcessVar.*;

@Service("createUserAndRole")
public class CreateUserAndRole implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(CreateUserAndRole.class);

    private final AESCryptor aesCryptor;

    public CreateUserAndRole(AESCryptor aesCryptor) {
        this.aesCryptor = aesCryptor;
    }

    @Override
    public void execute(DelegateExecution execution) {
        try {
            String accessToken = execution.getVariable(TOKEN_VAR_NAME.getValue()).toString();
            String jsonString = (String) execution.getVariable(CREATE_DTO_VAR_NAME.getValue());
            OrgCreateDto dto = objectMapper.readValue(jsonString, OrgCreateDto.class);

            UsersAndRolesService usersAndRolesService = new UsersAndRolesService(accessToken);

            String roleName = getDefaultRoleName(dto.getOrgId());
            String rawPassword = aesCryptor.decrypt(dto.getOwnerRawPassword());

            usersAndRolesService.createUser(dto.getGeoserverLogin(), rawPassword);
            usersAndRolesService.createRole(roleName);
            usersAndRolesService.associateUserWithRole(dto.getOwnerUserName(), roleName);

            execution.setVariable(CHECK_STATUS_VAR_NAME.getValue(), "SUCCESS");
            execution.setVariable(ITERATION_COUNTER_VAR_NAME.getValue(), 0);
        } catch (Exception e) {
            log.error("Failed to execute createUserAndRole step. Reason: {}", e.getMessage());
        }
    }
}
