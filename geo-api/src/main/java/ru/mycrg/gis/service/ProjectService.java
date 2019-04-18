package ru.mycrg.gis.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.OrgMqRequest;
import ru.mycrg.common.OrgMqResponse;
import ru.mycrg.common.enums.EventType;
import ru.mycrg.gis.controller.ProjectController;
import ru.mycrg.gis.entity.Organization;
import ru.mycrg.gis.entity.Project;
import ru.mycrg.gis.exceptions.EntityCreationException;
import ru.mycrg.gis.queue.IMqEvents;
import ru.mycrg.gis.repository.ProjectRepository;
import ru.mycrg.gis.util.Translit;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService {

    private static Logger log = LoggerFactory.getLogger(ProjectController.class);

    private final IMqEvents mqEvents;
    private final ProjectRepository projectRepository;
    private final OrganizationService organizationService;

    public ProjectService(ProjectRepository projectRepository,
                          IMqEvents mqEvents,
                          OrganizationService organizationService) {
        this.mqEvents = mqEvents;
        this.projectRepository = projectRepository;
        this.organizationService = organizationService;
    }

    public List<Project> getProjectByUser(String name) {
        return organizationService
                .getOrganizationByUser(name)
                .getProjects();
    }

    /**
     * Создаем проект у нас.
     * Находим организацию в которой состоит пользователь и для этой организации создаем проект.
     * (отправляем задание в очередь на создание проекта на геосервере)
     *
     * @param projectName Название проекта (человеческое)
     * @param userName Пользователь
     * @return нашу сущность проекта  {@link Project}
     */
    public Project create(String projectName, String userName) {
        log.debug("Create project: {}", projectName);

        Organization organization = organizationService.getOrganizationByUser(userName);

        Optional<Project> projectByName = projectRepository.findByInternalName(projectName);
        if (projectByName.isPresent()) {
            throw new EntityCreationException("Проект с таким именем уже существует");
        } else {
            Project newProject = projectRepository.save(new Project(projectName, Translit.doIt(projectName)));

            organization.addProject(newProject);
            organizationService.save(organization);

            OrgMqRequest mqRequest = new OrgMqRequest(organization.getId(), EventType.CREATE_PROJECT);
            mqRequest.setProjectName(newProject.getGeoserverName());
            mqRequest.setProjectId(newProject.getId());

            mqEvents.sendOrgEvent(mqRequest);

            return newProject;
        }
    }

    public void delete(long id) {
        log.warn("Not implemented yet...");
    }

    public void handleResponse(OrgMqResponse response) {

    }
}
