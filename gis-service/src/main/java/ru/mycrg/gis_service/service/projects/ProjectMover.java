package ru.mycrg.gis_service.service.projects;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.gis_service.dto.project.ProjectProjectionImpl;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.ForbiddenException;
import ru.mycrg.gis_service.queue.MessageBusProducer;
import ru.mycrg.gis_service.repository.ProjectRepository;
import ru.mycrg.gis_service.service.ProjectProtector;

import static java.time.LocalDateTime.now;
import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;

@Service
public class ProjectMover implements IProjectMover {

    private final Logger log = LoggerFactory.getLogger(ProjectMover.class);

    private final MessageBusProducer messageBus;
    private final ProjectService projectService;
    private final ProjectProtector projectProtector;
    private final ProjectRepository projectRepository;
    private final IAuthenticationFacade authenticationFacade;

    public ProjectMover(MessageBusProducer messageBus,
                        ProjectService projectService,
                        ProjectProtector projectProtector,
                        ProjectRepository projectRepository,
                        IAuthenticationFacade authenticationFacade) {
        this.messageBus = messageBus;
        this.projectService = projectService;
        this.projectProtector = projectProtector;
        this.projectRepository = projectRepository;
        this.authenticationFacade = authenticationFacade;
    }

    /**
     * Перемещает проекты
     *
     * @param movedProjectId что перемещаем
     * @param targetFolderId куда перемещаем (может быть null для перемещения на корневой уровень)
     */
    @Override
    @Transactional
    public void move(Long movedProjectId, Long targetFolderId) {
        projectProtector.throwIfMoveNotAllowed(movedProjectId);

        Project movedProject = projectService.getById(movedProjectId);
        if (targetFolderId == null) {
            movedProject.setPath(null);
        } else {
            ProjectProjectionImpl targetFolder = projectService.getByIdWithRole(targetFolderId);
            throwIfTargetNotAFolder(targetFolder);
            if (projectProtector.lessThenContributor(targetFolder)) {
                throw new ForbiddenException("Недостаточно прав для перемещения в папку: " + targetFolderId);
            }

            String folderPath = targetFolder.getPath();
            if (folderPath == null) {
                movedProject.setPath("/" + targetFolderId);
            } else {
                movedProject.setPath(folderPath + "/" + targetFolderId);
            }
        }

        movedProject.setLastModified(now());

        projectRepository.save(movedProject);

        log.debug("Переместили проект {} в папку {}", movedProjectId, targetFolderId);

        messageBus.produce(
                new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                  "MOVE",
                                  movedProject.getName(),
                                  "PROJECT",
                                  movedProject.getId(),
                                  objectMapper.convertValue(movedProject, JsonNode.class)));
    }
}
