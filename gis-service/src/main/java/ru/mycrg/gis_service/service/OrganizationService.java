package ru.mycrg.gis_service.service;

import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.engine.variable.VariableMap;
import org.camunda.bpm.engine.variable.Variables;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;
import ru.mycrg.gis_service.dto.geoserver.OrgCreateDto;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.repository.ProjectRepository;

import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.gis_service.bpmn.BPMNProcessKey.CREATE_ORGANIZATION;
import static ru.mycrg.gis_service.bpmn.BPMNProcessKey.REMOVE_ORGANIZATION;
import static ru.mycrg.gis_service.bpmn.BPMNProcessVar.*;
import static ru.mycrg.gis_service.service.ProjectService.DEFAULT_PROJECT_NAME;
import static ru.mycrg.mq_queue_contract.CrgConstants.DEFAULT_DB_NAME;
import static ru.mycrg.mq_queue_contract.CrgConstants.SCRATCH_DB_PREFIX;

@Service
public class OrganizationService {

    @Autowired
    private RuntimeService bpmnRuntimeService;

    @Autowired
    private ProjectRepository projectRepository;

    public ProcessInstance create(OrgCreateDto dto, Authentication authentication) {
        OAuth2AuthenticationDetails details = (OAuth2AuthenticationDetails) authentication.getDetails();

        VariableMap variables = Variables
                .createVariables()
                .putValue(CREATE_DTO_VAR_NAME.getValue(), dto.toJsonString())
                .putValue(TOKEN_VAR_NAME.getValue(), details.getTokenValue());

        return bpmnRuntimeService.startProcessInstanceByKey(
                CREATE_ORGANIZATION.getValue(),
                String.valueOf(dto.getOrgId()),
                variables);
    }

    public ProcessInstance delete(Long id, List<String> users, Authentication authentication) {
        OAuth2AuthenticationDetails details = (OAuth2AuthenticationDetails) authentication.getDetails();

        String dbName = DEFAULT_DB_NAME + id;
        String scratchWorkspaceName = SCRATCH_DB_PREFIX + dbName;

        List<String> workspaces = projectRepository
                .findAllByOrganizationId(id).stream()
                .map(Project::getId)
                .map(projectId -> DEFAULT_PROJECT_NAME + "_" + projectId)
                .collect(Collectors.toList());
        workspaces.add(scratchWorkspaceName);

        VariableMap variables = Variables
                .createVariables()
                .putValue(ORG_ID_VAR_NAME.getValue(), id)
                .putValue(WORKSPACES_VAR_NAME.getValue(), workspaces)
                .putValue(USERS_VAR_NAME.getValue(), users)
                .putValue(TOKEN_VAR_NAME.getValue(), details.getTokenValue());

        return bpmnRuntimeService.startProcessInstanceByKey(
                REMOVE_ORGANIZATION.getValue(),
                String.valueOf(id),
                variables);
    }
}
