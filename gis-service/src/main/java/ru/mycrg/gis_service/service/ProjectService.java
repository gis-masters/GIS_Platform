package ru.mycrg.gis_service.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.geoserver_client.services.projects.IProject;
import ru.mycrg.gis_service.dto.ProjectProjection;
import ru.mycrg.gis_service.dto.ProjectRequestDto;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.ConflictException;
import ru.mycrg.gis_service.exceptions.GisServiceException;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.repository.ProjectRepository;

import java.time.LocalDateTime;
import java.util.Optional;

import static ru.mycrg.gis_service.security.CrgClaimsParser.getOrganizationId;
import static ru.mycrg.gis_service.security.CrgClaimsParser.isRoot;

@Service
@Transactional
public class ProjectService {

    private static Logger log = LoggerFactory.getLogger(ProjectService.class);

    private final IProject geoserverClient;
    private final ProjectionFactory factory;
    private final ProjectRepository projectRepository;

    private final String DEFAULT_PROJECT_NAME = "workspace";

    public ProjectService(ProjectionFactory factory,
                          ProjectRepository projectRepository) {
        this.factory = factory;
        this.projectRepository = projectRepository;

        this.geoserverClient = new ru.mycrg.geoserver_client.services.projects.ProjectService();
    }

    public Page<ProjectProjection> findAll(Pageable pageable, Authentication authentication) {
        Page<Project> projects;
        if (isRoot(authentication)) {
            projects = projectRepository.findAll(pageable);
        } else {
            Long orgId = getOrganizationId(authentication);

            projects = projectRepository.findAllByOrganizationId(orgId, pageable);
        }

        return projects.map(project -> factory.createProjection(ProjectProjection.class, project));
    }

    public ProjectProjection findById(Long id, Authentication authentication) {
        Project project;
        if (isRoot(authentication)) {
            project = projectRepository
                    .findById(id)
                    .orElseThrow(() -> new NotFoundException("Not found project"));
        } else {
            Long orgId = getOrganizationId(authentication);

            project = projectRepository
                    .findByIdAndOrganizationId(id, orgId)
                    .orElseThrow(() -> new NotFoundException("Not found project"));
        }

        return factory.createProjection(ProjectProjection.class, project);
    }

    /**
     * Обновление проекта.
     * До тех пор пока меняется только название проекта, можно менять только алиас в нашей БД. Не меняя названия
     * рабочей области на геосервере и схемы в БД.
     *
     * @param id          Идентификатор проекта.
     * @param projectName Новое название проекта.
     */
    public void update(long id, String projectName, Authentication authentication) {
        Project project;
        if (isRoot(authentication)) {
            project = projectRepository
                    .findById(id)
                    .orElseThrow(() -> new NotFoundException("Not found project"));
        } else {
            Long orgId = getOrganizationId(authentication);

            project = projectRepository
                    .findByIdAndOrganizationId(id, orgId)
                    .orElseThrow(() -> new NotFoundException("Not found project"));
        }

        project.setName(projectName);
        project.setLastModified(LocalDateTime.now());

        projectRepository.save(project);
    }

    public ProjectProjection create(Long orgId, ProjectRequestDto dto) {
        log.info("Init create project: {} for organization: {}", dto.getProjectName(), orgId);

        Optional<Project> projectWithSameName =
                projectRepository.findByNameAndOrganizationId(dto.getProjectName(), orgId);
        if (projectWithSameName.isPresent()) {
            throw new ConflictException("Проект с таким именем уже существует");
        }

        Project newProject = new Project(dto.getProjectName(), orgId);
        Project savedProject = projectRepository.save(newProject);

        savedProject.setInternalName(DEFAULT_PROJECT_NAME + "_" + savedProject.getId());

        projectRepository.save(savedProject);

        try {
            geoserverClient.createProject(savedProject.getInternalName(), orgId);

            projectRepository.save(savedProject);
        } catch (GeoserverClientException e) {
            throw new ConflictException("Не удалось создать проект на геосервере", e.getCause());
        }

        return factory.createProjection(ProjectProjection.class, savedProject);
    }

    public void delete(Long orgId, Long projectId) {
        Project project = projectRepository
                .findByIdAndOrganizationId(projectId, orgId)
                .orElseThrow(() -> new NotFoundException("Not found project"));

        projectRepository.delete(project);

        try {
            geoserverClient.deleteProject(project.getInternalName());
        } catch (GeoserverClientException e) {
            throw new GisServiceException("Не удалось удалить проект на геосервере", e.getCause());
        }
    }

}
