package ru.mycrg.gis.service;

import com.fasterxml.jackson.databind.JsonNode;
import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.OrgMqProcessRequest;
import ru.mycrg.common.enums.ProcessStatus;
import ru.mycrg.common.enums.ProcessType;
import ru.mycrg.gis.controller.ProjectController;
import ru.mycrg.gis.dto.ProjectRequestDto;
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

import static ru.mycrg.gis.security.CrgClaimsParser.getOrganizationId;

@Service
@Transactional
public class ProjectService extends BaseProcessService {

    private static Logger log = LoggerFactory.getLogger(ProjectController.class);

    private final MqSender mqSender;
    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository,
                          ProcessRepository processRepository,
                          MqSender mqSender) {
        super(processRepository);

        this.mqSender = mqSender;
        this.projectRepository = projectRepository;
    }

    /**
     * Только проект который принадлежит указанной организации.
     *
     * @param orgId     Идентификатор организации
     * @param projectId Идентификатор проекта
     * @return Проект {@link Project}
     */
    public Project getProject(Long orgId, Long projectId) {
        return getProjectsByOrganization(orgId).stream()
                .filter(project -> projectId.equals(project.getId()))
                .findFirst()
                .orElseThrow(() -> new CrgNotFoundException("Не найден проект с id: " + projectId));
    }

    /**
     * Создаем проект у нас.
     * Отправляем задание в очередь на создание проекта на геосервере
     *
     * @param principal Пользователь
     * @return Инициированный процесс {@link Process}
     */
    public Process create(ProjectRequestDto dto, Principal principal) {
        long orgId = getOrganizationId(principal);

        log.info("Init create project process: {}", dto.getProjectName());

        Optional<Project> projectWithSameName = projectRepository.findByInternalName(dto.getProjectName());

        if (projectWithSameName.isPresent()) {
            throw new CrgConflictException("Проект с таким именем уже существует");
        } else {
            Project newProject = new Project(dto.getProjectName(), Translit.doIt(dto.getProjectName()), orgId);
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

    /**
     * Обновление проекта.
     * До тех пор пока меняется только название проекта, можно менять только алиас в нашей БД. Не меняя названия
     * рабочей области на геосервере и схемы в БД.
     *
     * @param projectId      Идентификатор проекта.
     * @param newProjectName Новое название проекта.
     */
    public void update(Long projectId, String newProjectName) {
        log.info("Update project by id: {}", projectId);

        Project project = projectRepository
                .findById(projectId)
                .orElseThrow(() -> new CrgNotFoundException("Не найден проект с id: " + projectId));

        project.setInternalName(newProjectName);

        projectRepository.save(project);
    }

    /**
     * Удаление проекта.
     *
     * @param projectId Идентификатор проекта
     * @param principal Пользователь
     * @return Инициированный процесс {@link Process}
     */
    public Process delete(long projectId, Principal principal) {
        long orgId = getOrganizationId(principal);

        log.info("Init process Delete project with id: {} for organization id: {}", projectId, orgId);

        Project project = projectRepository
                .findById(projectId)
                .orElseThrow(() -> new CrgNotFoundException("Не найден проект с id: " + projectId));

        Process process = create(principal.getName(),
                String.format("Удаление проекта: %s", project.getInternalName()),
                ProcessType.DELETE_PROJECT,
                project);

        // Отсылаем евент
        OrgMqProcessRequest payload = new OrgMqProcessRequest(orgId, project.getGeoserverName());

        mqSender.send(new BaseMqProcessRequest(process.getId(), ProcessType.DELETE_PROJECT, payload));

        return process;
    }

    @Override
    public void handleMqResponse(@NotNull BaseMqProcessResponse mqResponse) {
        if (mqResponse.getId() == null) {
            log.warn("Return invalid mqResponse: {}", mqResponse);
        }

        Process process = getProcessById(mqResponse.getId());
        switch (mqResponse.getType()) {
            case CREATE_PROJECT:
                handleProjectCreation(mqResponse, process);
                break;
            case DELETE_PROJECT:
                handleProjectDeletion(mqResponse, process);
                break;
            default:
                log.warn("Not supported type: {}", mqResponse.getType());
        }
    }

    private void handleProjectDeletion(@NotNull BaseMqProcessResponse mqResponse, @NotNull Process process) {
        Project project = fetchProjectFromProcess(process);
        if (project != null) {
            if (ProcessStatus.ERROR.equals(mqResponse.getStatus())) {
                error(process, mqResponse.getError());
            } else if (ProcessStatus.DONE.equals(mqResponse.getStatus())) {
                projectRepository.deleteById(project.getId());

                complete(process, null);
            } else {
                log.warn("Not supported process status for projectService. {}", process);
            }
        }
    }

    private void handleProjectCreation(@NotNull BaseMqProcessResponse mqResponse, @NotNull Process process) {
        Project project = fetchProjectFromProcess(process);
        if (project != null) {
            if (ProcessStatus.ERROR.equals(mqResponse.getStatus())) {
                projectRepository.deleteById(project.getId());

                error(process, mqResponse.getError());
            } else if (ProcessStatus.DONE.equals(mqResponse.getStatus())) {
                project.setStatus(mqResponse.getStatus());
                projectRepository.save(project);

                complete(process, null);
            } else {
                log.warn("Not supported process status for projectService. {}", process);
            }
        }
    }

    @Nullable
    private Project fetchProjectFromProcess(@NotNull Process process) {
        Long projectId;

        JsonNode extraInfo = process.getExtra();
        if (extraInfo != null) {
            projectId = extraInfo.get("id").asLong();
            Optional<Project> projectOptional = projectRepository.findById(projectId);
            if (projectOptional.isPresent()) {
                return projectOptional.get();
            } else {
                log.warn("Not found project by id: {}", projectId);

                return null;
            }
        } else {
            log.warn("empty extra: {}", process.toString());

            return null;
        }
    }

    public boolean isProjectAllowedForUser(Long orgId, Long projectId) {
        return getProjectsByOrganization(orgId).stream()
                .anyMatch(project -> project.getId().equals(projectId));
    }

    public Page<Project> findAll(Pageable pageable, Principal principal) {
        return projectRepository.findByOrganizationId(getOrganizationId(principal), pageable);
    }

    private List<Project> getProjectsByOrganization(Long orgId) {
        return projectRepository.findByOrganizationId(orgId);
    }

}
