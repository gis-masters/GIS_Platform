package ru.mycrg.gis_service.service;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.Variables;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.common_utils.CrgGlobalProperties;
import ru.mycrg.gis_service.dto.geoserver.OrgCreateDto;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.repository.ProjectRepository;

import java.util.List;

import static java.util.stream.Collectors.toList;
import static ru.mycrg.common_utils.CrgGlobalProperties.getScratchWorkspaceName;
import static ru.mycrg.gis_service.bpmn.BpmnProcessKey.CREATE_ORGANIZATION;
import static ru.mycrg.gis_service.bpmn.BpmnProcessKey.REMOVE_ORGANIZATION;
import static ru.mycrg.gis_service.bpmn.BpmnProcessVar.*;

@Service
public class OrganizationService {

    private final RuntimeService bpmnRuntimeService;

    private final ProjectRepository projectRepository;

    private final IAuthenticationFacade authenticationFacade;

    public OrganizationService(RuntimeService bpmnRuntimeService,
                               ProjectRepository projectRepository,
                               IAuthenticationFacade authenticationFacade) {
        this.bpmnRuntimeService = bpmnRuntimeService;
        this.projectRepository = projectRepository;
        this.authenticationFacade = authenticationFacade;
    }

    public ProcessInstance create(OrgCreateDto dto, Authentication authentication) {
        String login = dto.getGeoserverLogin();
        dto.setOwnerEmail(login);
        dto.setOwnerUserName(login);

        VariableMap variables = Variables
                .createVariables()
                .putValue(CREATE_DTO_VAR_NAME.getValue(), dto.toJsonString())
                .putValue(TOKEN_VAR_NAME.getValue(), authenticationFacade.getAccessToken());

        return bpmnRuntimeService.startProcessInstanceByKey(
                CREATE_ORGANIZATION.getValue(),
                String.valueOf(dto.getOrgId()),
                variables);
    }

    public ProcessInstance delete(Long id, List<String> geoserverLogins, Authentication authentication) {
        List<String> workspaces = projectRepository
                .findAllByOrganizationId(id).stream()
                .map(Project::getId)
                .map(CrgGlobalProperties::getDefaultProjectName)
                .collect(toList());
        workspaces.add(getScratchWorkspaceName(id));

        VariableMap variables = Variables
                .createVariables()
                .putValue(ORG_ID_VAR_NAME.getValue(), id)
                .putValue(WORKSPACES_VAR_NAME.getValue(), workspaces)
                .putValue(USERS_VAR_NAME.getValue(), geoserverLogins)
                .putValue(TOKEN_VAR_NAME.getValue(), authenticationFacade.getAccessToken());

        return bpmnRuntimeService.startProcessInstanceByKey(
                REMOVE_ORGANIZATION.getValue(),
                String.valueOf(id),
                variables);
    }
}
