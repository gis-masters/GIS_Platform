package ru.mycrg.gis_service.service.projects;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.ForbiddenException;
import ru.mycrg.gis_service.queue.MessageBusProducer;
import ru.mycrg.gis_service.repository.ProjectRepository;
import ru.mycrg.gis_service.service.ResourceProtector;

import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;

@Service
public class ProjectFolderMover implements IProjectMover {

    private final Logger log = LoggerFactory.getLogger(ProjectFolderMover.class);

    private final MessageBusProducer messageBus;
    private final ProjectService projectService;
    private final ProjectRepository projectRepository;
    private final ResourceProtector resourceProtector;
    private final IAuthenticationFacade authenticationFacade;

    public ProjectFolderMover(MessageBusProducer messageBus,
                              ProjectService projectService,
                              ProjectRepository projectRepository,
                              ResourceProtector resourceProtector,
                              IAuthenticationFacade authenticationFacade) {
        this.messageBus = messageBus;
        this.projectService = projectService;
        this.projectRepository = projectRepository;
        this.resourceProtector = resourceProtector;
        this.authenticationFacade = authenticationFacade;
    }

    /**
     * Перемещает папки проектов
     *
     * @param movedFolderId  что перемещаем
     * @param targetFolderId куда перемещаем (может быть null для перемещения на корневой уровень)
     */
    @Override
    @Transactional
    public void move(Long movedFolderId, Long targetFolderId) {
        Project movedFolder = projectService.getById(movedFolderId);
        if (!resourceProtector.isOwner(movedFolder)) {
            throw new ForbiddenException("Недостаточно прав для перемещения проекта: " + movedFolder.getName());
        }

        if (targetFolderId == null) {
            String oldSelfPath = getSelfPath(movedFolder);
            String newSelfPath = "/" + movedFolder.getId();

            projectRepository.moveFolderToRoot(movedFolderId, oldSelfPath, newSelfPath);

            log.debug("Переместили папку проектов: {} в корень", movedFolderId);
        } else {
            Project targetFolder = projectService.getById(targetFolderId);
            if (!resourceProtector.isOwner(targetFolder)) {
                throw new ForbiddenException("Недостаточно прав для перемещения в: " + targetFolder.getName());
            }

            throwIfTargetNotAFolder(targetFolder);

            String movedFolderSelfPath = getSelfPath(movedFolder);
            String targetFolderSelfPath = getSelfPath(targetFolder);
            String newParentForChildren = targetFolderSelfPath + "/" + movedFolder.getId();

            projectRepository.moveFolder(movedFolderId,
                                         movedFolderSelfPath,
                                         newParentForChildren,
                                         targetFolderSelfPath);

            log.debug("Переместили папку проектов: {} в папку: {}", movedFolderId, targetFolderId);
        }

        messageBus.produce(
                new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                  "MOVE",
                                  movedFolder.getName(),
                                  "PROJECT_FOLDER",
                                  movedFolder.getId(),
                                  objectMapper.convertValue(movedFolder, JsonNode.class)));
    }
}
