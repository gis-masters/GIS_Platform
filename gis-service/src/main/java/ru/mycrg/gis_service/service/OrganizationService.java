package ru.mycrg.gis_service.service;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.Variables;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;
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

    public OrganizationService(RuntimeService bpmnRuntimeService, ProjectRepository projectRepository) {
        this.bpmnRuntimeService = bpmnRuntimeService;
        this.projectRepository = projectRepository;
    }

    public ProcessInstance create(OrgCreateDto dto, Authentication authentication) {
        OAuth2AuthenticationDetails details = (OAuth2AuthenticationDetails) authentication.getDetails();

        String login = dto.getGeoserverLogin();
        dto.setOwnerEmail(login);
        dto.setOwnerUserName(login);

        VariableMap variables = Variables
                .createVariables()
                .putValue(CREATE_DTO_VAR_NAME.getValue(), dto.toJsonString())
                .putValue(TOKEN_VAR_NAME.getValue(), details.getTokenValue());

        return bpmnRuntimeService.startProcessInstanceByKey(
                CREATE_ORGANIZATION.getValue(),
                String.valueOf(dto.getOrgId()),
                variables);
    }

    public ProcessInstance delete(Long id, List<String> geoserverLogins, Authentication authentication) {
        OAuth2AuthenticationDetails details = (OAuth2AuthenticationDetails) authentication.getDetails();

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
                .putValue(TOKEN_VAR_NAME.getValue(), details.getTokenValue());

        return bpmnRuntimeService.startProcessInstanceByKey(
                REMOVE_ORGANIZATION.getValue(),
                String.valueOf(id),
                variables);
    }
}
