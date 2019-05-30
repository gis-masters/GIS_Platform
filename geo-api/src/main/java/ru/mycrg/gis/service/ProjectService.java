package ru.mycrg.gis.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.OrgMqProcessRequest;
import ru.mycrg.common.enums.RequestType;
import ru.mycrg.gis.controller.ProjectController;
import ru.mycrg.gis.dto.ProjectRequestDto;
import ru.mycrg.gis.entity.Organization;
import ru.mycrg.gis.entity.Project;
import ru.mycrg.gis.exceptions.CrgConflictException;
import ru.mycrg.gis.queue.IMqEvents;
import ru.mycrg.gis.repository.ProjectRepository;
import ru.mycrg.gis.util.Translit;

import java.util.List;
import java.util.Optional;

@Service
public class ProjectService extends BaseProcessService {

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

//    public List<Project> getProjectByUser(String name) {
//        return organizationService
//                .getOrganizationByUser(name)
//                .getProjects();
//    }

    public List<Project> getProjects(Long orgId) {
        return organizationService.findById(orgId).getProjects();
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
        Optional<Project> projectWithSameName = organization.getProjects().stream()
                .filter(project -> project.getInternalName().equals(projectName))
                .findFirst();

        if (projectWithSameName.isPresent()) {
            throw new CrgConflictException("Проект с таким именем уже существует");
        } else {
            Project newProject = projectRepository.save(new Project(projectName, Translit.doIt(projectName)));
            newProject.setGeoserverName(newProject.getGeoserverName() + "_" + newProject.getId());
            projectRepository.save(newProject);

            organization.addProject(newProject);
            organizationService.save(organization);

            CrgProcess process = new CrgProcess<>(new ProjectRequestDto(newProject.getGeoserverName()));
            processes.add(process);

            OrgMqProcessRequest mqRequest = new OrgMqProcessRequest(process.getId(), organization.getId(),
                    newProject.getGeoserverName(), RequestType.CREATE_PROJECT);

            // Отсылаем евент
            mqEvents.sendOrgEvent(mqRequest);

            return newProject;
        }
    }

    public void delete(long id) {
        log.warn("Not implemented yet...");
    }

    @Override
    public void handleMqResponse(BaseMqProcessResponse mqResponse) {
        if (mqResponse.getId() == null) {
            log.warn("Return invalid mqResponse");
        }

        Optional<CrgProcess> processById = getProcessById(mqResponse.getId());
        if (processById.isPresent()) {
            CrgProcess process = processById.get();

            process.complete(mqResponse);

            ProjectRequestDto request = (ProjectRequestDto) process.getRequest();

            Optional<Project> projectOptional = projectRepository.findByGeoserverName(request.getProjectName());
            if (projectOptional.isPresent()) {
                Project project = projectOptional.get();
                if (!mqResponse.isNull()) {
                    project.setStatus(mqResponse.getStatus());
                } else {
                    log.warn("Status must not be empty: {}", mqResponse.getStatus());
                }

                projectRepository.save(project);
            } else {
                log.warn("Not found project by name: {}", request.getProjectName());
            }
        } else {
            log.warn("Not found create project process by id: {}", mqResponse.getId());
        }
    }
}
