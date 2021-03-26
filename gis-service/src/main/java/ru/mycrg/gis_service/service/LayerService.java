package ru.mycrg.gis_service.service;

import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.gis_service.dto.*;
import ru.mycrg.gis_service.entity.Group;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.exceptions.ConflictException;
import ru.mycrg.gis_service.exceptions.ErrorInfo;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.json.JsonPatcher;
import ru.mycrg.gis_service.repository.LayerRepository;

import javax.json.JsonMergePatch;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static ru.mycrg.gis_service.mappers.LayerMapper.layerMapper;
import static ru.mycrg.gis_service.security.CrgClaimsParser.getOrganizationId;

@Service
@Transactional
public class LayerService {

    public static final Logger log = LoggerFactory.getLogger(LayerService.class);

    private final JsonPatcher jsonPatcher;
    private final ProjectService projectService;
    private final LayerRepository layerRepository;

    public static final String DATA_SERVICE_API_PREFIX = "/api/data";

    public LayerService(JsonPatcher jsonPatcher,
                        LayerRepository layerRepository,
                        ProjectService projectService) {
        this.jsonPatcher = jsonPatcher;
        this.projectService = projectService;
        this.layerRepository = layerRepository;
    }

    public List<LayerProjection> findAll(long projectId, Authentication authentication) {
        return projectService
                .getById(projectId, authentication)
                .getLayers().stream()
                .map(layer -> new LayerProjection(layer, getOrgWorkspaceName(authentication)))
                .collect(Collectors.toList());
    }

    public LayerProjection findById(long projectId, long layerId, Authentication authentication) {
        List<Layer> layers = projectService.getById(projectId, authentication).getLayers();

        Layer layer = findLayerById(layers, layerId);

        return new LayerProjection(layer, getOrgWorkspaceName(authentication));
    }

    public LayerProjection create(long projectId, LayerCreateDto dto, Authentication authentication) {
        Project project = projectService.getById(projectId, authentication);

        Layer layer = createLayer(dto, project);

        return new LayerProjection(layer, getOrgWorkspaceName(authentication));
    }

    public void update(long projectId, long layerId, JsonMergePatch patchDto, Authentication authentication) {
        Project project = projectService.getById(projectId, authentication);
        Layer layerForUpdate = findLayerById(project.getLayers(), layerId);

        LayerUpdateDto layerDto = layerMapper.toDto(layerForUpdate);
        LayerUpdateDto patchedLayer = jsonPatcher.mergePatch(patchDto, layerDto, LayerUpdateDto.class);

        layerMapper.update(layerForUpdate, patchedLayer);

        updateGroup(layerForUpdate, patchedLayer.getParentId(), project.getGroups());

        layerForUpdate.setLastModified(LocalDateTime.now());

        layerRepository.save(layerForUpdate);
    }

    public void delete(Layer layer) {
        layerRepository.deleteLayerById(layer.getId());
    }

    public List<RelatedLayersModel> findRelatedLayers(String field, String value,
                                                      Authentication authentication) {
        Set<Long> projectIds = projectService.getAll(authentication).stream()
                                             .map(Project::getId)
                                             .collect(Collectors.toSet());
        List<Layer> relatedLayers;
        if ("table".equals(field)) {
            relatedLayers = layerRepository.findRelatedByTableName(value, projectIds);
        } else if ("dataset".equals(field)) {
            relatedLayers = layerRepository.findRelatedByDataset(value, projectIds);
        } else {
            throw new BadRequestException("Not support related field: " + field,
                                          new ErrorInfo("field", "Allowed: 'dataset', 'table'"));
        }

        return relatedLayers.stream()
                .map(layer -> {
                    LayerProjection lProjection = new LayerProjection(layer, getOrgWorkspaceName(authentication));
                    ProjectProjection pProjection = projectService
                            .getProjectionById(layer.getProject().getId(), authentication);

                    return new RelatedLayersModel(lProjection, pProjection);
                })
                .collect(Collectors.toList());
    }

    private void updateGroup(Layer layer, Long parentId, List<Group> groups) {
        if (parentId != null) {
            Group parentGroup = groups
                    .stream()
                    .filter(group -> group.getId().equals(parentId))
                    .findFirst()
                    .orElseThrow(() -> new BadRequestException("parentId: Родительская группа задана неверно"));

            layer.setParent(parentGroup);
        } else {
            layer.setParent(null);
        }
    }

    @NotNull
    private Layer createLayer(LayerCreateDto dto, Project project) {
        if (layerRepository.findByTableNameAndProject(dto.getTableName(), project).isPresent()) {
            throw new ConflictException("Layer with same tableName already exist");
        }

        Layer newLayer = new Layer(dto);
        if ("vector".equals(dto.getType())) {
            String dataSourceUri = DATA_SERVICE_API_PREFIX + "/datasets/" + dto.getDataset() + "/tables/" + dto.getTableName();
            newLayer.setDataSourceUri(dataSourceUri);
        }

        newLayer.setProject(project);

        final Layer savedLayer = layerRepository.save(newLayer);

        updateGroup(savedLayer, dto.getParentId(), project.getGroups());

        return savedLayer;
    }

    private Layer findLayerById(List<Layer> layers, Long layerId) {
        return layers.stream()
                     .filter(l -> layerId.equals(l.getId()))
                     .findFirst()
                     .orElseThrow(() -> new NotFoundException(layerId));
    }

    @NotNull
    private String getOrgWorkspaceName(Authentication authentication) {
        return "scratch_database_" + getOrganizationId(authentication);
    }
}
