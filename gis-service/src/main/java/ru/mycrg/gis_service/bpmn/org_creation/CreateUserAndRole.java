package ru.mycrg.gis_service.bpmn.org_creation;

import lombok.extern.log4j.Log4j2;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.organization.AES;
import ru.mycrg.geoserver_client.services.user_role.UsersAndRolesService;
import ru.mycrg.gis_service.dto.geoserver.OrgCreateDto;

import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;
import static ru.mycrg.gis_service.bpmn.IJavaDelegateProperties.CREATE_DTO_VAR_NAME;
import static ru.mycrg.gis_service.bpmn.IJavaDelegateProperties.TOKEN_VAR_NAME;
import static ru.mycrg.mq_queue_contract.CrgConstants.*;

@Log4j2
@Service("createUserAndRole")
public class CreateUserAndRole implements JavaDelegate {

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final String accessToken = execution.getVariable(TOKEN_VAR_NAME).toString();
        final String jsonString = (String) execution.getVariable(CREATE_DTO_VAR_NAME);
        OrgCreateDto dto = objectMapper.readValue(jsonString, OrgCreateDto.class);

        UsersAndRolesService usersAndRolesService = new UsersAndRolesService(accessToken);

        String roleName = DEFAULT_ROLE_NAME + dto.getOrgId();
        String rawPassword = AES.decrypt(dto.getOwnerRawPassword(), dto.getOwnerEmail());

        usersAndRolesService.createUser(dto.getOwnerEmail(), rawPassword);
        usersAndRolesService.createRole(roleName);
        usersAndRolesService.associateUserWithRole(dto.getOwnerUserName(), roleName);
    }
}
