package ru.mycrg.gis_service.service;

import com.fasterxml.jackson.databind.JsonNode;
import events.CrgAuditEvent;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
import ru.mycrg.gis_service.queue.MessageBusProducer;
import ru.mycrg.gis_service.repository.LayerRepository;
import ru.mycrg.gis_service.security.IAuthenticationFacade;

import javax.json.JsonMergePatch;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static dto.AuditEventActionsType.*;
import static dto.AuditEventEntityType.LAYER;
import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;
import static ru.mycrg.gis_service.mappers.LayerMapper.layerMapper;

@Service
@Transactional
public class LayerService {

    public static final Logger log = LoggerFactory.getLogger(LayerService.class);

    public static final String DATA_SERVICE_API_PREFIX = "/api/data";

    private final JsonPatcher jsonPatcher;
    private final ProjectService projectService;
    private final LayerRepository layerRepository;
    private final IAuthenticationFacade authenticationFacade;
    private final MessageBusProducer messageBus;

    public LayerService(JsonPatcher jsonPatcher,
                        LayerRepository layerRepository,
                        ProjectService projectService,
                        IAuthenticationFacade authenticationFacade,
                        MessageBusProducer messageBus) {
        this.jsonPatcher = jsonPatcher;
        this.projectService = projectService;
        this.layerRepository = layerRepository;
        this.authenticationFacade = authenticationFacade;
        this.messageBus = messageBus;
    }

    public List<LayerProjection> findAll(long projectId) {
        return projectService
                .getById(projectId)
                .getLayers().stream()
                .map(layer -> new LayerProjection(layer, getOrgWorkspaceName()))
                .collect(Collectors.toList());
    }

    public LayerProjection findByTableName(String tableName) {
        List<Layer> layers = new ArrayList<>();
        projectService.getAll().stream()
                      .map(Project::getLayers)
                      .forEach(layers::addAll);

        Layer foundLayer = layers.stream()
                                 .filter(layer -> layer.getTableName().equals(tableName))
                                 .findFirst()
                                 .orElseThrow(() -> new NotFoundException(tableName));

        return new LayerProjection(foundLayer, getOrgWorkspaceName());
    }

    public LayerProjection findById(long projectId, long layerId) {
        List<Layer> layers = projectService.getById(projectId).getLayers();

        Layer layer = findLayerById(layers, layerId);

        return new LayerProjection(layer, getOrgWorkspaceName());
    }

    public LayerProjection create(long projectId, LayerCreateDto dto) {
        Project project = projectService.getById(projectId);

        Layer layer = createLayer(dto, project);

        messageBus.produce(new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                             CREATE,
                                             layer.getTableName(),
                                             LAYER,
                                             layer.getId(),
                                             objectMapper.convertValue(dto, JsonNode.class)));

        return new LayerProjection(layer, getOrgWorkspaceName());
    }

    public void update(long projectId, long layerId, JsonMergePatch patchDto) {
        Project project = projectService.getById(projectId);
        Layer layerForUpdate = findLayerById(project.getLayers(), layerId);

        LayerUpdateDto layerDto = layerMapper.toDto(layerForUpdate);
        LayerUpdateDto patchedLayer = jsonPatcher.mergePatch(patchDto, layerDto, LayerUpdateDto.class);

        layerMapper.update(layerForUpdate, patchedLayer);

        updateGroup(layerForUpdate, patchedLayer.getParentId(), project.getGroups());

        layerForUpdate.setLastModified(LocalDateTime.now());

        layerRepository.save(layerForUpdate);

        messageBus.produce(
                new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                  UPDATE,
                                  layerForUpdate.getTableName(),
                                  LAYER,
                                  layerForUpdate.getId(),
                                  objectMapper.convertValue(layerDto, JsonNode.class)));
    }

    public void delete(@NotNull Layer layer) {
        layerRepository.deleteLayerById(layer.getId());

        messageBus.produce(new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                             DELETE,
                                             layer.getTableName(),
                                             LAYER,
                                             layer.getId()));
    }

    public void deleteByTableName(String tableName) {
        layerRepository.deleteByTableName(tableName);
    }

    public List<RelatedLayersModel> findRelatedLayers(String field, String value) {
        Set<Long> projectIds = projectService.getAll().stream()
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
                                LayerProjection lProjection = new LayerProjection(layer, getOrgWorkspaceName());
                                ProjectProjection pProjection = projectService
                                        .getProjectionByIdUnsafe(layer.getProject().getId());

                                return new RelatedLayersModel(lProjection, pProjection);
                            })
                            .collect(Collectors.toList());
    }

    public Page<Layer> findLayers(String raster, List<Project> projects, Pageable pageable) {
        return layerRepository.findByTypeAndProjectIn(raster, projects, pageable);
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
    private String getOrgWorkspaceName() {
        return "scratch_database_" + authenticationFacade.getOrganizationId();
    }
}
