package ru.mycrg.gis_service.service;

import org.springframework.data.projection.ProjectionFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.gis_service.dto.BaseMapCreateDto;
import ru.mycrg.gis_service.dto.BaseMapProjection;
import ru.mycrg.gis_service.entity.BaseMap;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.exceptions.ConflictException;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.json.JsonPatcher;
import ru.mycrg.gis_service.repository.BaseMapRepository;

import javax.json.JsonMergePatch;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static ru.mycrg.gis_service.mappers.BaseMapMapper.baseMapMapper;

@Service
@Transactional
public class BaseMapService {

    private final JsonPatcher jsonPatcher;
    private final ProjectService projectService;
    private final BaseMapRepository baseMapRepository;
    private final ProjectionFactory projectionFactory;

    public BaseMapService(JsonPatcher jsonPatcher,
                          ProjectService projectService,
                          ProjectionFactory projectionFactory,
                          BaseMapRepository baseMapRepository) {
        this.jsonPatcher = jsonPatcher;
        this.projectService = projectService;
        this.baseMapRepository = baseMapRepository;
        this.projectionFactory = projectionFactory;
    }

    public List<BaseMapProjection> getAll(long projectId, Authentication authentication) {
        return getBaseMaps(projectId, authentication).stream()
                .map(baseMap -> projectionFactory.createProjection(BaseMapProjection.class, baseMap))
                .collect(Collectors.toList());
    }

    public void create(long projectId, BaseMapCreateDto dto, Authentication authentication) {
        Project project = projectService.getById(projectId, authentication);
        project.getBaseMaps().stream()
                .filter(baseMap -> baseMap.getBaseMapId().equals(dto.getBaseMapId()))
                .findFirst()
                .ifPresent(baseMap -> {
                    throw new ConflictException("Basemap " + dto.getBaseMapId() + " already joined");
                });

        BaseMap baseMap = new BaseMap(dto);

        baseMapRepository.save(baseMap);

        project.addBaseMap(baseMap);
    }

    public void delete(long projectId, Long baseMapId, Authentication authentication) {
        Project project = projectService.getById(projectId, authentication);

        BaseMap baseMap = baseMapRepository.findByBaseMapId(baseMapId)
                .orElseThrow(() -> new BadRequestException("Id of basemap incorrect"));

        project.getBaseMaps().remove(baseMap);
    }

    public void update(long projectId, long baseMapId, JsonMergePatch patchDto, Authentication authentication) {
        Set<BaseMap> baseMaps = getBaseMaps(projectId, authentication);
        BaseMap baseMapForUpdate = getBaseMapById(baseMaps, baseMapId);

        BaseMapCreateDto baseMapDto = baseMapMapper.toDto(baseMapForUpdate);
        BaseMapCreateDto patchedBaseMap = jsonPatcher.mergePatch(patchDto, baseMapDto, BaseMapCreateDto.class);

        baseMapMapper.update(baseMapForUpdate, patchedBaseMap);

        baseMapForUpdate.setLastModified(LocalDateTime.now());

        baseMapRepository.save(baseMapForUpdate);
    }

    public BaseMapProjection findById(long projectId, long baseMapId, Authentication authentication) {
        Set<BaseMap> baseMaps = getBaseMaps(projectId, authentication);
        BaseMap baseMapById = getBaseMapById(baseMaps, baseMapId);

        return projectionFactory.createProjection(BaseMapProjection.class, baseMapById);
    }

    private Set<BaseMap> getBaseMaps(long projectId, Authentication authentication) {
        return projectService
                .getById(projectId, authentication)
                .getBaseMaps();
    }

    private BaseMap getBaseMapById(Set<BaseMap> baseMaps, Long baseMapId) {
        return baseMaps.stream()
                .filter(baseMap -> baseMap.getId().equals(baseMapId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException(baseMapId));
    }

}
