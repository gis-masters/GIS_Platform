package ru.mycrg.gis_service.service.layers;

import com.fasterxml.jackson.databind.JsonNode;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.audit_service_contract.events.CrgAuditEvent;
import ru.mycrg.gis_service.dto.*;
import ru.mycrg.gis_service.entity.Group;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.*;
import ru.mycrg.gis_service.json.JsonPatcher;
import ru.mycrg.gis_service.queue.MessageBusProducer;
import ru.mycrg.gis_service.repository.LayerRepository;
import ru.mycrg.gis_service.security.IAuthenticationFacade;
import ru.mycrg.gis_service.service.ProjectService;
import ru.mycrg.gis_service.service.ResourceProtector;
import ru.mycrg.http_client.exceptions.HttpClientException;

import javax.json.JsonMergePatch;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toMap;
import static ru.mycrg.common_utils.CrgGlobalProperties.getScratchWorkspaceName;
import static ru.mycrg.gis_service.GisServiceApplication.objectMapper;
import static ru.mycrg.gis_service.mappers.LayerMapper.layerMapper;

@Service
@Transactional
public class LayerService {

    public final Logger log = LoggerFactory.getLogger(LayerService.class);

    public static final String DATA_SERVICE_API_PREFIX = "/api/data";

    private final JsonPatcher jsonPatcher;
    private final ProjectService projectService;
    private final LayerRepository layerRepository;
    private final IAuthenticationFacade authenticationFacade;
    private final MessageBusProducer messageBus;
    private final ResourceProtector resourceProtector;
    private final Map<String, ILayerHandler> layerHandlers;

    public LayerService(JsonPatcher jsonPatcher,
                        LayerRepository layerRepository,
                        ProjectService projectService,
                        IAuthenticationFacade authenticationFacade,
                        MessageBusProducer messageBus,
                        ResourceProtector resourceProtector,
                        List<ILayerHandler> layerHandlers) {
        this.jsonPatcher = jsonPatcher;
        this.projectService = projectService;
        this.layerRepository = layerRepository;
        this.authenticationFacade = authenticationFacade;
        this.messageBus = messageBus;
        this.resourceProtector = resourceProtector;
        this.layerHandlers = layerHandlers.stream()
                                          .collect(toMap(ILayerHandler::getType, Function.identity()));
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
                                 .orElseThrow(() -> new NotFoundException("Не найден слой: " + tableName));

        return new LayerProjection(foundLayer, getOrgWorkspaceName());
    }

    public LayerProjection findById(long projectId, long layerId) {
        List<Layer> layers = projectService.getById(projectId).getLayers();

        Layer layer = findLayerById(layers, layerId);

        return new LayerProjection(layer, getOrgWorkspaceName());
    }

    /**
     * Создание векторных, растровых и внешних слоёв. В нашем проекте и на геосервере при необходимости.
     *
     * @param projectId Идентификатор проекта
     * @param layerDto  Модель слоя
     */
    public Optional<LayerProjection> create(long projectId, LayerCreateDto layerDto) {
        Project project = projectService.getById(projectId);

        try {
            ILayerHandler layerHandler = layerHandlers.get(layerDto.getType());
            if (layerHandler == null) {
                throw new IllegalStateException("No handlers exist for layer type: " + layerDto.getType());
            }

            Optional<Layer> oLayer = layerHandler.create(project, layerDto);
            if (oLayer.isPresent()) {
                Layer layer = oLayer.get();
                updateGroup(layer, layerDto.getParentId(), project.getGroups());

                messageBus.produce(new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                                     "CREATE",
                                                     buildLayerInfo(project, layer),
                                                     "LAYER",
                                                     layer.getId(),
                                                     objectMapper.convertValue(layerDto, JsonNode.class)));

                LayerProjection newLayer = new LayerProjection(layer, getOrgWorkspaceName());

                return Optional.of(newLayer);
            } else {
                log.debug("Raster layer was created only on geoserver");

                return Optional.empty();
            }
        } catch (HttpClientException e) {
            String msg = String.format("Не удалось создать слой: '%s'", layerDto.getTitle());

            throw new GisServiceException(msg, e.getCause());
        }
    }

    public void update(long projectId, long layerId, JsonMergePatch patchDto) {
        Project project = projectService.getById(projectId);
        if (!resourceProtector.isOwner(project)) {
            throw new ForbiddenException("редактирования", "проекта", project.getName());
        }

        Layer layerForUpdate = findLayerById(project.getLayers(), layerId);

        LayerUpdateDto layerDto = layerMapper.toDto(layerForUpdate);
        LayerUpdateDto patchedLayer = jsonPatcher.mergePatch(patchDto, layerDto, LayerUpdateDto.class);

        layerMapper.update(layerForUpdate, patchedLayer);

        updateGroup(layerForUpdate, patchedLayer.getParentId(), project.getGroups());

        layerForUpdate.setLastModified(LocalDateTime.now());

        layerRepository.save(layerForUpdate);

        messageBus.produce(
                new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                  "UPDATE",
                                  buildLayerInfo(project, layerForUpdate),
                                  "LAYER",
                                  layerForUpdate.getId(),
                                  objectMapper.convertValue(layerDto, JsonNode.class)));
    }

    public void delete(@NotNull Layer layer) {
        layerRepository.deleteLayerById(layer.getId());

        messageBus.produce(new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                             "DELETE",
                                             buildLayerInfo(layer.getProject(), layer),
                                             "LAYER",
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

    public Page<Layer> findLayers(String layerType, List<Project> projects, Pageable pageable) {
        Set<Long> projectIds = projects.stream()
                                       .map(Project::getId)
                                       .collect(Collectors.toSet());

        return layerRepository.findUniqueLayers(layerType, projectIds, pageable);
    }

    public Page<Layer> findLayers(String layerType, String schemaId, Pageable pageable) {
        return layerRepository.findByTypeAndSchemaId(layerType, schemaId, pageable);
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
    private String buildLayerInfo(Project project, Layer layer) {
        return String.format("%s_%s_%s", project.getName(), layer.getTableName(), layer.getTitle());
    }

    private Layer findLayerById(List<Layer> layers,
                                Long layerId) {
        return layers.stream()
                     .filter(l -> layerId.equals(l.getId()))
                     .findFirst()
                     .orElseThrow(() -> new NotFoundException(layerId));
    }

    @NotNull
    private String getOrgWorkspaceName() {
        return getScratchWorkspaceName(authenticationFacade.getOrganizationId());
    }
}
