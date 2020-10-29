package ru.mycrg.gis_service.bpmn.org_creation;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_service_contract.AESCryptor;
import ru.mycrg.geoserver_client.services.user_role.UsersAndRolesService;
import ru.mycrg.gis_service.dto.geoserver.OrgCreateDto;

import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;
import static ru.mycrg.gis_service.bpmn.IJavaDelegateProperties.CREATE_DTO_VAR_NAME;
import static ru.mycrg.gis_service.bpmn.IJavaDelegateProperties.TOKEN_VAR_NAME;
import static ru.mycrg.mq_queue_contract.CrgConstants.DEFAULT_ROLE_NAME;

@Service("createUserAndRole")
public class CreateUserAndRole implements JavaDelegate {

    @Autowired
    private AESCryptor aesCryptor;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final String accessToken = execution.getVariable(TOKEN_VAR_NAME).toString();
        final String jsonString = (String) execution.getVariable(CREATE_DTO_VAR_NAME);
        OrgCreateDto dto = objectMapper.readValue(jsonString, OrgCreateDto.class);

        UsersAndRolesService usersAndRolesService = new UsersAndRolesService(accessToken);

        String roleName = DEFAULT_ROLE_NAME + dto.getOrgId();
        String rawPassword = aesCryptor.decrypt(dto.getOwnerRawPassword());

        usersAndRolesService.createUser(dto.getOwnerEmail(), rawPassword);
        usersAndRolesService.createRole(roleName);
        usersAndRolesService.associateUserWithRole(dto.getOwnerUserName(), roleName);
    }
}
