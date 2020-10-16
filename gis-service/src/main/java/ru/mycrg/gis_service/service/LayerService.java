package ru.mycrg.gis_service.service;

import lombok.extern.log4j.Log4j2;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.geoserver_client.GeoserverClientResponse;
import ru.mycrg.geoserver_client.services.layers.LayersService;
import ru.mycrg.gis_service.dto.LayerCreateDto;
import ru.mycrg.gis_service.dto.LayerProjection;
import ru.mycrg.gis_service.dto.LayerUpdateDto;
import ru.mycrg.gis_service.entity.Group;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.exceptions.ConflictException;
import ru.mycrg.gis_service.exceptions.GisServiceException;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.json.JsonPatcher;
import ru.mycrg.gis_service.repository.LayerRepository;

import javax.json.JsonMergePatch;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.gis_service.mappers.LayerMapper.layerMapper;
import static ru.mycrg.gis_service.security.CrgAuthHelper.getToken;
import static ru.mycrg.gis_service.service.ProjectService.DEFAULT_PROJECT_NAME;

@Log4j2
@Service
@Transactional
public class LayerService {

    private final ProjectionFactory factory;
    private final ProjectService projectService;
    private final LayerRepository layerRepository;
    private final JsonPatcher jsonPatcher;

    public static final String DATA_SERVICE_API_PREFIX = "/api/data";

    public LayerService(ProjectionFactory factory,
                        JsonPatcher jsonPatcher,
                        LayerRepository layerRepository,
                        ProjectService projectService) {
        this.factory = factory;
        this.jsonPatcher = jsonPatcher;
        this.projectService = projectService;
        this.layerRepository = layerRepository;
    }

    public List<LayerProjection> findAll(long projectId, Authentication authentication) {
        return projectService
                .getById(projectId, authentication)
                .getLayers().stream()
                .map(layer -> factory.createProjection(LayerProjection.class, layer))
                .collect(Collectors.toList());
    }

    public LayerProjection findById(long projectId, long layerId, Authentication authentication) {
        List<Layer> layers = projectService.getById(projectId, authentication).getLayers();

        Layer layer = findLayerById(layers, layerId);

        return factory.createProjection(LayerProjection.class, layer);
    }

    public LayerProjection create(long projectId, LayerCreateDto dto, Authentication authentication) {
        Project project = projectService.getById(projectId, authentication);

        Layer layer = createLayer(dto, project);

        return factory.createProjection(LayerProjection.class, layer);
    }

    public void update(long projectId, long layerId, JsonMergePatch patchDto, Authentication authentication) {
        Project project = projectService.getById(projectId, authentication);
        Layer layerForUpdate = findLayerById(project.getLayers(), layerId);

        LayerUpdateDto layerDto = layerMapper.toDto(layerForUpdate);
        LayerUpdateDto patchedLayer = jsonPatcher.mergePatch(patchDto, layerDto, LayerUpdateDto.class);

        layerMapper.update(layerForUpdate, patchedLayer);

        updateGroup(layerForUpdate, patchedLayer, project.getGroups());

        layerForUpdate.setLastModified(LocalDateTime.now());

        layerRepository.save(layerForUpdate);
    }

    public void delete(Layer layer, long projectId, Authentication authentication) {
        String complexLayerName = getComplexLayerName(layer, projectId);

        log.debug("Try delete layer: {}", complexLayerName);

        layerRepository.deleteLayerById(layer.getId());

        GeoserverClientResponse response = new LayersService(getToken(authentication)).delete(complexLayerName);
        if (!response.isSuccessful()) {
            if (response.isNotFound()) {
                log.warn("Layer not exist on geoserver");
            } else {
                log.debug("Geoserver response: {}", response.toString());
                throw new GisServiceException("Не удалось удалить слой с геосервера. " + response.getMsg());
            }
        }
    }

    @NotNull
    private String getComplexLayerName(Layer layer, long projectId) {
        return DEFAULT_PROJECT_NAME + "_" + projectId + ":" + layer.getInternalName();
    }

    private void updateGroup(Layer layer, LayerUpdateDto dto, List<Group> groups) {
        if (dto.getGroupId() != null) {
            Group parentGroup = groups.stream()
                    .filter(group -> group.getId().equals(dto.getGroupId()))
                    .findFirst()
                    .orElseThrow(() -> new BadRequestException("groupId: Родительская группа задана неверно"));

            layer.setGroup(parentGroup);
        } else {
            layer.setGroup(null);
        }
    }

    @NotNull
    private Layer createLayer(LayerCreateDto dto, Project project) {
        if (layerRepository.findByInternalNameAndProject(dto.getInternalName(), project).isPresent()) {
            throw new ConflictException("Layer with same internalName already exist");
        }

        Layer newLayer = new Layer(dto);

        String projectName = DEFAULT_PROJECT_NAME + "_" + project.getId();
        if ("vector".equals(dto.getType())) {
            String dataSourceUri = DATA_SERVICE_API_PREFIX + "/datasets/" + projectName + "/tables/" + dto.getInternalName();
            newLayer.setDataSourceUri(dataSourceUri);
        }

        newLayer.setProject(project);

        return layerRepository.save(newLayer);
    }

    private Layer findLayerById(List<Layer> layers, Long layerId) {
        return layers.stream()
                .filter(l -> layerId.equals(l.getId()))
                .findFirst()
                .orElseThrow(() -> new NotFoundException(layerId));
    }
}
