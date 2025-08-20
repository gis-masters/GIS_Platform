package ru.mycrg.gis_service.service;

import org.springframework.data.projection.ProjectionFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.gis_service.dto.BaseMapCreateDto;
import ru.mycrg.gis_service.dto.BaseMapProjection;
import ru.mycrg.gis_service.dto.project.ProjectProjection;
import ru.mycrg.gis_service.entity.BaseMap;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.ConflictException;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.json.JsonPatcher;
import ru.mycrg.gis_service.repository.BaseMapRepository;
import ru.mycrg.gis_service.service.projects.ProjectService;

import javax.json.JsonMergePatch;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static ru.mycrg.gis_service.mappers.BaseMapMapper.baseMapMapper;

@Service
@Transactional
public class BasemapService {

    private final JsonPatcher jsonPatcher;
    private final ProjectService projectService;
    private final BaseMapRepository baseMapRepository;
    private final ProjectionFactory projectionFactory;

    public BasemapService(JsonPatcher jsonPatcher,
                          ProjectService projectService,
                          ProjectionFactory projectionFactory,
                          BaseMapRepository baseMapRepository) {
        this.jsonPatcher = jsonPatcher;
        this.projectService = projectService;
        this.baseMapRepository = baseMapRepository;
        this.projectionFactory = projectionFactory;
    }

    public List<BaseMapProjection> getAll(long projectId) {
        return getBaseMaps(projectId)
                .stream()
                .map(baseMap -> projectionFactory.createProjection(BaseMapProjection.class, baseMap))
                .collect(Collectors.toList());
    }

    public BaseMapProjection create(long projectId, BaseMapCreateDto dto) {
        Project project = projectService.getById(projectId);
        project.getBaseMaps().stream()
               .filter(baseMap -> baseMap.getBaseMapId().equals(dto.getBaseMapId()))
               .findFirst()
               .ifPresent(baseMap -> {
                   throw new ConflictException("Basemap " + dto.getBaseMapId() + " already joined");
               });

        BaseMap baseMap = new BaseMap(dto);

        BaseMap newBaseMap = baseMapRepository.save(baseMap);

        project.addBaseMap(baseMap);

        return projectionFactory.createProjection(BaseMapProjection.class, newBaseMap);
    }

    public void delete(long projectId, Long id) {
        Project project = projectService.getById(projectId);

        BaseMap baseMap = baseMapRepository.findById(id)
                                           .orElseThrow(() -> new NotFoundException(BaseMap.class, id));

        project.getBaseMaps().remove(baseMap);
        baseMapRepository.delete(baseMap);
    }

    public void deleteByBasemapId(Long sourceBasemapId) {
        baseMapRepository.findAllByBaseMapId(sourceBasemapId)
                         .forEach(basemap -> {
                             basemap.getProjects()
                                    .forEach(project -> project.getBaseMaps().remove(basemap));

                             baseMapRepository.delete(basemap);
                         });
    }

    public void update(long projectId, long baseMapId, JsonMergePatch patchDto) {
        Set<BaseMap> baseMaps = getBaseMaps(projectId);
        BaseMap baseMapForUpdate = getBaseMapById(baseMaps, baseMapId);

        BaseMapCreateDto baseMapDto = baseMapMapper.toDto(baseMapForUpdate);
        BaseMapCreateDto patchedBaseMap = jsonPatcher.mergePatch(patchDto, baseMapDto, BaseMapCreateDto.class);

        baseMapMapper.update(baseMapForUpdate, patchedBaseMap);

        baseMapForUpdate.setLastModified(LocalDateTime.now());

        baseMapRepository.save(baseMapForUpdate);
    }

    public BaseMapProjection findById(long projectId, long baseMapId) {
        Set<BaseMap> baseMaps = getBaseMaps(projectId);
        BaseMap baseMapById = getBaseMapById(baseMaps, baseMapId);

        return projectionFactory.createProjection(BaseMapProjection.class, baseMapById);
    }

    /**
     * Return all projects related to the specific "source basemap".
     *
     * @param sourceBasemapId Id of source basemap
     *
     * @return list of related projects to the "source basemap"
     */
    public List<ProjectProjection> findRelatedProjects(long sourceBasemapId) {
        final List<Project> projects = new ArrayList<>();

        baseMapRepository
                .findAllByBaseMapId(sourceBasemapId)
                .forEach(basemap -> projects.addAll(basemap.getProjects()));

        return projects.stream()
                       .map(baseMap -> projectionFactory.createProjection(ProjectProjection.class, baseMap))
                       .collect(Collectors.toList());
    }

    private Set<BaseMap> getBaseMaps(long projectId) {
        return projectService.getById(projectId)
                             .getBaseMaps();
    }

    private BaseMap getBaseMapById(Set<BaseMap> baseMaps, Long baseMapId) {
        return baseMaps.stream()
                       .filter(baseMap -> baseMap.getId().equals(baseMapId))
                       .findFirst()
                       .orElseThrow(() -> new NotFoundException(baseMapId));
    }
}
