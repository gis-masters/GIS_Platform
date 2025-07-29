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
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.gis_service.dto.LayerCreateDto;
import ru.mycrg.gis_service.dto.LayerProjection;
import ru.mycrg.gis_service.dto.LayerUpdateDto;
import ru.mycrg.gis_service.dto.RelatedLayersModel;
import ru.mycrg.gis_service.dto.project.ProjectProjection;
import ru.mycrg.gis_service.dto.project.ProjectProjectionImpl;
import ru.mycrg.gis_service.entity.Group;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.*;
import ru.mycrg.gis_service.json.JsonPatcher;
import ru.mycrg.gis_service.queue.MessageBusProducer;
import ru.mycrg.gis_service.repository.LayerRepository;
import ru.mycrg.gis_service.service.ProjectProtector;
import ru.mycrg.gis_service.service.projects.ProjectService;

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

    private final JsonPatcher jsonPatcher;
    private final ProjectService projectService;
    private final LayerRepository layerRepository;
    private final IAuthenticationFacade authenticationFacade;
    private final MessageBusProducer messageBus;
    private final ProjectProtector projectProtector;
    private final Map<String, ILayerHandler> layerHandlers;

    public LayerService(JsonPatcher jsonPatcher,
                        LayerRepository layerRepository,
                        ProjectService projectService,
                        IAuthenticationFacade authenticationFacade,
                        MessageBusProducer messageBus,
                        ProjectProtector projectProtector,
                        List<ILayerHandler> layerHandlers) {
        this.jsonPatcher = jsonPatcher;
        this.projectService = projectService;
        this.layerRepository = layerRepository;
        this.authenticationFacade = authenticationFacade;
        this.messageBus = messageBus;
        this.projectProtector = projectProtector;
        this.layerHandlers = layerHandlers.stream()
                                          .collect(toMap(ILayerHandler::getType, Function.identity()));
    }

    public List<LayerProjection> getAll(long projectId) {
        return projectService
                .getById(projectId)
                .getLayers().stream()
                .map(layer -> new LayerProjection(layer, getOrgWorkspaceName()))
                .collect(Collectors.toList());
    }

    public LayerProjection getByTableName(String tableName) {
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

    public LayerProjection getById(long projectId, long layerId) {
        List<Layer> layers = projectService.getById(projectId).getLayers();

        Layer layer = getLayerById(layers, layerId);

        return new LayerProjection(layer, getOrgWorkspaceName());
    }

    /**
     * Создание векторных, растровых и внешних слоёв. В нашем проекте и на геосервере при необходимости.
     *
     * @param projectId Идентификатор проекта
     * @param layerDto  Модель слоя
     */
    public Optional<LayerProjection> create(long projectId, LayerCreateDto layerDto) {
        ProjectProjectionImpl projectProjection = projectService.getByIdWithRole(projectId);
        if (projectProtector.lessThenContributor(projectProjection)) {
            throw new ForbiddenException("редактирования", "проекта", projectProjection.getName());
        }

        Project project = projectService.getById(projectId);

        try {
            ILayerHandler layerHandler = layerHandlers.get(layerDto.getType());
            if (layerHandler == null) {
                throw new IllegalStateException("Не существует обработчика для слоя типа: " + layerDto.getType());
            }

            Optional<Layer> oLayer = layerHandler.create(project, layerDto);
            if (oLayer.isPresent()) {
                Layer layer = oLayer.get();
                updateGroup(layer, layerDto.getParentId(), project.getGroups());

                messageBus.produce(new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                                     "CREATE",
                                                     layer.getTableName(),
                                                     "LAYER",
                                                     layer.getId(),
                                                     objectMapper.convertValue(layerDto, JsonNode.class)));

                LayerProjection newLayer = new LayerProjection(layer, getOrgWorkspaceName());

                return Optional.of(newLayer);
            } else {
                log.debug("Layer was created only on geoserver");

                return Optional.empty();
            }
        } catch (Exception e) {
            String msg = String.format("Не удалось создать слой: '%s'", layerDto.getTitle());

            log.error("{} => {}", msg, e.getMessage(), e);

            throw new GisServiceException(msg, e.getCause());
        }
    }

    public void update(long projectId, long layerId, JsonMergePatch patchDto) {
        ProjectProjectionImpl projectProjection = projectService.getByIdWithRole(projectId);
        if (projectProtector.lessThenContributor(projectProjection)) {
            throw new ForbiddenException("редактирования", "проекта", projectProjection.getName());
        }

        Layer layerForUpdate = layerRepository.findById(layerId)
                                              .orElseThrow(() -> new NotFoundException(layerId));

        try {
            LayerUpdateDto layerDto = layerMapper.toDto(layerForUpdate);
            LayerUpdateDto patchedLayer = jsonPatcher.mergePatch(patchDto, layerDto, LayerUpdateDto.class);

            layerMapper.update(layerForUpdate, patchedLayer);

            Project project = projectService.getById(projectId);
            updateGroup(layerForUpdate, patchedLayer.getParentId(), project.getGroups());

            layerForUpdate.setLastModified(LocalDateTime.now());

            layerRepository.save(layerForUpdate);

            messageBus.produce(
                    new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                      "UPDATE",
                                      layerForUpdate.getTableName(),
                                      "LAYER",
                                      layerForUpdate.getId(),
                                      objectMapper.convertValue(layerDto, JsonNode.class)));
        } catch (Exception e) {
            String msg = "Не удалось обновить слой: " + layerId;

            throw new GisServiceException(msg, e.getCause());
        }
    }

    public void delete(long projectId, long layerId) {
        ProjectProjectionImpl project = projectService.getByIdWithRole(projectId);
        if (projectProtector.lessThenContributor(project)) {
            throw new ForbiddenException("редактирования", "проекта", project.getName());
        }

        Layer layerForDelete = layerRepository.findById(layerId)
                                              .orElseThrow(() -> new NotFoundException(layerId));
        layerRepository.deleteLayerById(layerId);

        messageBus.produce(
                new CrgAuditEvent(authenticationFacade.getAccessToken(),
                                  "DELETE",
                                  layerForDelete.getTableName(),
                                  "LAYER",
                                  layerForDelete.getId()));
    }

    public void deleteByTableName(String tableName) {
        layerRepository.deleteByTableName(tableName);
    }

    public List<RelatedLayersModel> getRelatedLayers(String field, String value) {
        Set<Long> projectIds = projectService.getAll().stream()
                                             .map(Project::getId)
                                             .collect(Collectors.toSet());
        if (projectIds.isEmpty()) {
            return new ArrayList<>();
        }

        List<Layer> relatedLayers;
        if ("table".equals(field)) {
            relatedLayers = layerRepository.findRelatedByTableName(value, projectIds);
        } else if ("nativeCRS".equals(field)) {
            relatedLayers = layerRepository.findByNativeCRS(value);
        } else if ("dataset".equals(field)) {
            relatedLayers = layerRepository.findRelatedByDataset(value, projectIds);
        } else {
            throw new BadRequestException("Not support related field: " + field,
                                          new ErrorInfo("field", "Allowed: 'dataset', 'table'"));
        }

        return mapToRelatedLayersModel(relatedLayers);
    }

    public List<RelatedLayersModel> getRelatedToFilesLayers(UUID fileId) {
        Set<Long> projectIds = projectService.getAll().stream()
                                             .map(Project::getId)
                                             .collect(Collectors.toSet());
        List<Layer> relatedLayers = projectIds.isEmpty()
                ? new ArrayList<>()
                : layerRepository.findRelatedByFileId(fileId.toString(), projectIds);

        return mapToRelatedLayersModel(relatedLayers);
    }

    public Page<Layer> getUniqueLayers(String layerType, List<Project> projects, Pageable pageable) {
        Set<Long> projectIds = projects.stream()
                                       .map(Project::getId)
                                       .collect(Collectors.toSet());

        return layerRepository.findUniqueLayers(layerType, projectIds, pageable);
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

    private Layer getLayerById(List<Layer> layers, Long layerId) {
        return layers.stream()
                     .filter(l -> layerId.equals(l.getId()))
                     .findFirst()
                     .orElseThrow(() -> new NotFoundException(layerId));
    }

    private List<RelatedLayersModel> mapToRelatedLayersModel(List<Layer> relatedLayers) {
        return relatedLayers.stream()
                            .map(layer -> {
                                LayerProjection lProjection = new LayerProjection(layer, getOrgWorkspaceName());
                                ProjectProjection pProjection = projectService
                                        .getProjectionByIdUnsafe(layer.getProject().getId());

                                return new RelatedLayersModel(lProjection, pProjection);
                            })
                            .collect(Collectors.toList());
    }

    @NotNull
    private String getOrgWorkspaceName() {
        return getScratchWorkspaceName(authenticationFacade.getOrganizationId());
    }
}
