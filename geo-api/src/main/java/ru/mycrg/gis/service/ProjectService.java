package ru.mycrg.gis.service;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.OrgMqProcessRequest;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.common.enums.ProcessType;
import ru.mycrg.gis.controller.ProjectController;
import ru.mycrg.gis.dto.ProjectModel;
import ru.mycrg.gis.dto.ProjectRequestDto;
import ru.mycrg.gis.entity.Organization;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.entity.Project;
import ru.mycrg.gis.exceptions.CrgConflictException;
import ru.mycrg.gis.exceptions.CrgNotFoundException;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.repository.ProcessRepository;
import ru.mycrg.gis.repository.ProjectRepository;
import ru.mycrg.gis.util.Translit;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static ru.mycrg.common.CrgConstants.DEFAULT_DB_NAME;
import static ru.mycrg.common.CrgConstants.DEFAULT_STORE_POSTFIX;

@Service
public class ProjectService extends BaseProcessService {

    private static Logger log = LoggerFactory.getLogger(ProjectController.class);

    private final MqSender mqSender;
    private final ProjectRepository projectRepository;
    private final OrganizationService organizationService;

    public ProjectService(ProjectRepository projectRepository,
                          ProcessRepository processRepository,
                          MqSender mqSender,
                          OrganizationService organizationService) {
        super(processRepository);

        this.mqSender = mqSender;
        this.projectRepository = projectRepository;
        this.organizationService = organizationService;
    }

    /**
     * Проекты принадлежащие организации.
     * Перед выборкой проверяет имеет ли права пользователь на доступ к проекту
     * @param orgId
     * @return
     */
    @Transactional
    public List<ProjectModel> getProjects(Long orgId) {
        return organizationService.findById(orgId)
                .getProjects().stream()
                .map(project -> mapToProjectModel(orgId, project))
                .collect(Collectors.toList());
    }

    /**
     * Только проект который принадлежит указанной организации.
     * @param orgId
     * @param projectId
     * @return
     */
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
     * @param principal
     * @return нашу сущность проекта  {@link Project}
     */
    @Transactional
    public Process create(Long orgId, ProjectRequestDto dto, Principal principal) {
        log.info("Init create project process: {}", dto.getProjectName());

        Organization organization = organizationService.findById(orgId);
        Optional<Project> projectWithSameName = organization.getProjects().stream()
                .filter(project -> project.getInternalName().equals(dto.getProjectName()))
                .findFirst();

        if (projectWithSameName.isPresent()) {
            throw new CrgConflictException("Проект с таким именем уже существует");
        } else {
            Project newProject = new Project(dto.getProjectName(), Translit.doIt(dto.getProjectName()), organization);
            Project savedProject = projectRepository.save(newProject);
            savedProject.setGeoserverName(savedProject.getGeoserverName() + "_" + savedProject.getId());

            projectRepository.save(savedProject);

            Process process = create(
                    principal.getName(),
                    String.format("Создание проекта: %s", dto.getProjectName()),
                    ProcessType.CREATE_PROJECT,
                    savedProject);

            // Отсылаем евент
            OrgMqProcessRequest payload = new OrgMqProcessRequest(orgId, savedProject.getGeoserverName());

            mqSender.send(new BaseMqProcessRequest(process.getId(), ProcessType.CREATE_PROJECT, payload));

            return process;
        }
    }

    @Transactional
    public Process delete(long orgId, long projectId, Principal principal) {
        log.info("Init process Delete project by id: {}", projectId);

        Project project = projectRepository
                .findById(projectId)
                .orElseThrow(() -> new CrgNotFoundException("Не найден проект с id: " + projectId));

        Organization organization = organizationService.findById(orgId);
        organization.removeProject(project);

        Process process = create(principal.getName(),
                String.format("Удаление проекта: %s", project.getInternalName()),
                ProcessType.DELETE_PROJECT);

        // Отсылаем евент
        mqSender.send(new BaseMqProcessRequest(process.getId(), ProcessType.DELETE_PROJECT, project.getGeoserverName()));

        return process;
    }

    @Override
    @Transactional
    public void handleMqResponse(@NotNull BaseMqProcessResponse mqResponse) {
        if (mqResponse.getId() == null) {
            log.warn("Return invalid mqResponse: {}", mqResponse);
        }

        Process process = getProcessById(mqResponse.getId());
        switch (mqResponse.getType()) {
            case CREATE_PROJECT: handleProjectCreation(mqResponse, process); break;
//            case DELETE_PROJECT: handleProjectDeletion(mqResponse, process); break;
        }
    }

//    private void handleProjectDeletion(@NotNull BaseMqProcessResponse mqResponse, @NotNull Process process) {
//        if (ProcessStatus.ERROR.equals(mqResponse.getStatus())) {
//            error(process);
//        } else {
//            complete(process);
//        }
//    }

    private void handleProjectCreation(@NotNull BaseMqProcessResponse mqResponse, @NotNull Process process) {
        Long projectId = process.getExtra().get("id").asLong();

        Optional<Project> projectOptional = projectRepository.findById(projectId);
        if (projectOptional.isPresent()) {
            Project project = projectOptional.get();

            if (ProcessStatus.ERROR.equals(mqResponse.getStatus())) {
                project.getOrganization()
                       .removeProject(project);

                error(process, mqResponse.getError());
            } else if (ProcessStatus.DONE.equals(mqResponse.getStatus())) {
                project.setStatus(mqResponse.getStatus());
                projectRepository.save(project);

                complete(process, null);
            } else {
                log.warn("Not supported process status for projectService. {}", process);
            }
        } else {
            log.warn("Not found project by id: {}", projectId);
        }
    }

    private ProjectModel mapToProjectModel(Long orgId, Project project) {
        ProjectModel projectModel = new ProjectModel(project);
        projectModel.setDatabaseName(DEFAULT_DB_NAME + orgId);
        projectModel.setStoreName(DEFAULT_DB_NAME + orgId + DEFAULT_STORE_POSTFIX);

        return projectModel;
    }
}
