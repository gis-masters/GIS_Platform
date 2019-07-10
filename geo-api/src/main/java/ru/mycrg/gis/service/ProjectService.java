package ru.mycrg.gis.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.OrgMqProcessRequest;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.common.enums.ProcessType;
import ru.mycrg.gis.controller.ProjectController;
import ru.mycrg.gis.dto.ExportRequestModel;
import ru.mycrg.gis.dto.ProjectModel;
import ru.mycrg.gis.dto.ProjectRequestDto;
import ru.mycrg.gis.entity.Organization;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.entity.Project;
import ru.mycrg.gis.exceptions.CrgConflictException;
import ru.mycrg.gis.exceptions.CrgNotFoundException;
import ru.mycrg.gis.queue.IMqEvents;
import ru.mycrg.gis.repository.ProjectRepository;
import ru.mycrg.gis.util.Translit;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.mycrg.common.CrgConstants.DEFAULT_DB_NAME;
import static ru.mycrg.common.CrgConstants.DEFAULT_STORE_POSTFIX;

@Service
public class ProjectService implements Processable {

    private static Logger log = LoggerFactory.getLogger(ProjectController.class);

    private final IMqEvents mqEvents;
    private final ProjectRepository projectRepository;
    private final ProcessService processService;
    private final OrganizationService organizationService;

    public ProjectService(ProjectRepository projectRepository,
                          IMqEvents mqEvents,
                          ProcessService processService,
                          OrganizationService organizationService) {
        this.mqEvents = mqEvents;
        this.projectRepository = projectRepository;
        this.processService = processService;
        this.organizationService = organizationService;
    }

    @Transactional
    public List<ProjectModel> getProjects(Long orgId) {
        return organizationService.findById(orgId)
                .getProjects().stream()
                .map(project -> mapToProjectModel(orgId, project))
                .collect(Collectors.toList());
    }

    @Transactional
    public ProjectModel getProject(Long orgId, Long projectId) {
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
    public ProjectModel create(Long orgId, ProjectRequestDto projectDto) {
        log.info("Init create project process: {}", projectDto.getProjectName());

        Organization organization = organizationService.findById(orgId);
        Optional<Project> projectWithSameName = organization.getProjects().stream()
                .filter(project -> project.getInternalName().equals(projectDto.getProjectName()))
                .findFirst();

        if (projectWithSameName.isPresent()) {
            throw new CrgConflictException("Проект с таким именем уже существует");
        } else {
            Process process = processService.create(
                    String.format("Создание проекта: %s", projectDto.getProjectName()),
                    ProcessType.CREATE_PROJECT);

            Project newProject = new Project(projectDto.getProjectName(), Translit.doIt(projectDto.getProjectName()),
                    organization);
            Project savedProject = projectRepository.save(newProject);
            savedProject.setGeoserverName(savedProject.getGeoserverName() + "_" + savedProject.getId());

            projectRepository.save(savedProject);

//          new ProjectRequestDto(savedProject.getGeoserverName());

            // Отсылаем евент
            OrgMqProcessRequest mqRequest = new OrgMqProcessRequest(process.getId(), orgId,
                    savedProject.getGeoserverName(), ProcessType.CREATE_PROJECT);

            mqEvents.sendOrgEvent(mqRequest);

            return mapToProjectModel(orgId, savedProject);
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

//        CrgProcess process = new CrgProcess<>(new ProjectRequestDto(project.getGeoserverName()));
//        processes.add(process);
//
//        OrgMqProcessRequest mqRequest = new OrgMqProcessRequest(process.getId(), orgId,
//                project.getGeoserverName(), ProcessType.DELETE_PROJECT);

        // Отсылаем евент
//        mqEvents.sendOrgEvent(mqRequest);
    }

    public void export(Long orgId, Long projectId, ExportRequestModel requestModel) {
        ProjectModel project = getProject(orgId, projectId);

        log.debug("Try export {} layers", requestModel.getLayers().size());
    }

    @Override
    public void handleMqResponse(BaseMqProcessResponse mqResponse) {
        if (mqResponse.getId() == null) {
            log.warn("Return invalid mqResponse");
        }

        Optional<Process> processById = processService.getProcessById(mqResponse.getId());
        if (processById.isPresent()) {
            Process process = processById.get();

            Optional<Project> projectOptional = projectRepository.findByGeoserverName(process.getProjectName());
            if (projectOptional.isPresent()) {
                Project project = projectOptional.get();

                if (mqResponse.getType() == ProcessType.CREATE_PROJECT) {
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

    private ProjectModel mapToProjectModel(Long orgId, Project project) {
        ProjectModel projectModel = new ProjectModel(project);
        projectModel.setDatabaseName(DEFAULT_DB_NAME + orgId);
        projectModel.setStoreName(DEFAULT_DB_NAME + orgId + DEFAULT_STORE_POSTFIX);

        return projectModel;
    }
}
