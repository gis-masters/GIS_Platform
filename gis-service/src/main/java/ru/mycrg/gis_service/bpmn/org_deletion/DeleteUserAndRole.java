package ru.mycrg.gis_service.bpmn.org_deletion;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.user_role.UsersAndRolesService;

import java.util.List;

import static ru.mycrg.common_utils.CrgGlobalProperties.getDefaultRoleName;
import static ru.mycrg.gis_service.bpmn.BpmnProcessVar.*;

@Service("deleteUserAndRole")
public class DeleteUserAndRole implements JavaDelegate {

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final Object orgId = execution.getVariable(ORG_ID_VAR_NAME.getValue());
        final String accessToken = execution.getVariable(TOKEN_VAR_NAME.getValue()).toString();
        List<String> users = (List<String>) execution.getVariable(USERS_VAR_NAME.getValue());

        UsersAndRolesService usersAndRolesService = new UsersAndRolesService(accessToken);

        String roleName = getDefaultRoleName(orgId);

        for (String userName: users) {
            usersAndRolesService.deleteUser(userName);
        }

        usersAndRolesService.deleteRole(roleName);
    }
}
