package ru.mycrg.wrapper.geoserver_client;

import org.springframework.stereotype.Service;
import ru.mycrg.common.OrgMqProcessRequest;
import ru.mycrg.wrapper.geoserver_client.services.AuthService;
import ru.mycrg.wrapper.geoserver_client.services.OrganizationService;
import ru.mycrg.wrapper.geoserver_client.services.ProjectService;

import java.io.IOException;
import java.util.Optional;

@Service
public class GeoserverClientFacadeImpl implements IGeoserverClientFacade {

    private final ProjectService projectService;
    private final AuthService authService;
    private final OrganizationService organizationService;

    public GeoserverClientFacadeImpl(OrganizationService organizationService,
                                     ProjectService projectService,
                                     AuthService authService) {
        this.organizationService = organizationService;
        this.projectService = projectService;
        this.authService = authService;
    }

    @Override
    public Optional authorize() throws IOException {
        return authService.authorize();
    }

    @Override
    public void createOrganization(OrgMqProcessRequest mqRequest) throws IOException, RuntimeException {
        organizationService.createOrganization(mqRequest);
    }

    @Override
    public void createProject(String projectName, Long orgId) throws IOException, RuntimeException {
        projectService.createProject(projectName, orgId);
    }

    @Override
    public void deleteProject(String projectName) {
        projectService.deleteProject(projectName);
    }
}
