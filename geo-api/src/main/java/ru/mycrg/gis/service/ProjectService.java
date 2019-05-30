package ru.mycrg.gis.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.OrgMqProcessRequest;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.common.enums.RequestType;
import ru.mycrg.gis.controller.ProjectController;
import ru.mycrg.gis.dto.ProjectRequestDto;
import ru.mycrg.gis.entity.Organization;
import ru.mycrg.gis.entity.Project;
import ru.mycrg.gis.exceptions.CrgConflictException;
import ru.mycrg.gis.exceptions.CrgNotFoundException;
import ru.mycrg.gis.queue.IMqEvents;
import ru.mycrg.gis.repository.ProjectRepository;
import ru.mycrg.gis.util.Translit;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

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

    @Transactional
    public List<Project> getProjects(Long orgId) {
        return organizationService.findById(orgId).getProjects();
    }

    @Transactional
    public Project getProject(Long orgId, Long projectId) {
        return getProjects(orgId).stream()
                .filter(project -> projectId == project.getId())
                .findFirst()
                .orElseThrow(() -> new CrgNotFoundException("Не найден проект с id: " + projectId));
    }

    /**
     * Создаем проект у нас.
     * Отправляем задание в очередь на создание проекта на геосервере
     *
     * @param orgId id организации
     * @return нашу сущность проекта  {@link Project}
     */
    @Transactional
    public Project create(Long orgId, ProjectRequestDto projectDto) {
        log.info("Init create project process: {}", projectDto.getProjectName());

        Organization organization = organizationService.findById(orgId);
        Optional<Project> projectWithSameName = organization.getProjects().stream()
                .filter(project -> project.getInternalName().equals(projectDto.getProjectName()))
                .findFirst();

        if (projectWithSameName.isPresent()) {
            throw new CrgConflictException("Проект с таким именем уже существует");
        } else {
            Project newProject = new Project(projectDto.getProjectName(), Translit.doIt(projectDto.getProjectName()),
                    organization);
            Project savedProject = projectRepository.save(newProject);
            savedProject.setGeoserverName(savedProject.getGeoserverName() + "_" + savedProject.getId());

            projectRepository.save(savedProject);

            CrgProcess process = new CrgProcess<>(new ProjectRequestDto(savedProject.getGeoserverName()));
            processes.add(process);

            OrgMqProcessRequest mqRequest = new OrgMqProcessRequest(process.getId(), orgId,
                    savedProject.getGeoserverName(), RequestType.CREATE_PROJECT);

            // Отсылаем евент
            mqEvents.sendOrgEvent(mqRequest);

            return savedProject;
        }
    }

    @Transactional
    public void delete(long orgId, long projectId) {
        log.info("Delete project by id: {}", projectId);

        Organization organization = organizationService.findById(orgId);
        Project project = projectRepository
                .findById(projectId)
                .orElseThrow(() -> new CrgNotFoundException("Не найден проект с id: " + projectId));

        organization.removeProject(project);

        CrgProcess process = new CrgProcess<>(new ProjectRequestDto(project.getGeoserverName()));
        processes.add(process);

        OrgMqProcessRequest mqRequest = new OrgMqProcessRequest(process.getId(), orgId,
                project.getGeoserverName(), RequestType.DELETE_PROJECT);

        // Отсылаем евент
        mqEvents.sendOrgEvent(mqRequest);
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

                if (mqResponse.getType() == RequestType.CREATE_PROJECT) {
                    if (ProcessStatus.ERROR.equals(mqResponse.getStatus())) {
                        projectRepository.delete(project);
                    } else {
                        if (!mqResponse.isNull()) {
                            project.setStatus(mqResponse.getStatus());

                            log.info("Successfully created project: {}", project.getGeoserverName());
                        } else {
                            log.warn("Status must not be empty: {}", mqResponse.getStatus());
                        }

                        projectRepository.save(project);
                    }
                } else {
                    log.warn("Other project event type");
                }
            } else {
                log.warn("Not found project by name: {}", request.getProjectName());
            }
        } else {
            log.warn("Not found create project process by id: {}", mqResponse.getId());
        }
    }
}
