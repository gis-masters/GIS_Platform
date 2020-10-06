package ru.mycrg.gis_service.bpmn.org_deletion;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.user_role.UsersAndRolesService;

import java.util.List;

import static ru.mycrg.gis_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.mq_queue_contract.CrgConstants.DEFAULT_ROLE_NAME;

@Service("deleteUserAndRole")
public class DeleteUserAndRole implements JavaDelegate {

    @Override
    public void execute(DelegateExecution execution) {
        final Object orgId = execution.getVariable(ORG_ID_VAR_NAME);
        final String accessToken = execution.getVariable(TOKEN_VAR_NAME).toString();
        List<String> users = (List<String>) execution.getVariable(USERS_VAR_NAME);

        UsersAndRolesService usersAndRolesService = new UsersAndRolesService(accessToken);

        String roleName = DEFAULT_ROLE_NAME + orgId;

        users.forEach(userName -> {
            usersAndRolesService.deleteUser(userName);
        });

        usersAndRolesService.deleteRole(roleName);
    }
}
