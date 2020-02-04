package ru.mycrg.gis_service.service;

import org.jetbrains.annotations.NotNull;
import org.springframework.data.projection.ProjectionFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.geoserver_client.services.layers.LayersService;
import ru.mycrg.gis_service.dto.LayerCreateDto;
import ru.mycrg.gis_service.dto.LayerProjection;
import ru.mycrg.gis_service.dto.LayerUpdateDto;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.ConflictException;
import ru.mycrg.gis_service.exceptions.GisServiceException;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.repository.LayerRepository;

import javax.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;

import static ru.mycrg.gis_service.security.CrgAuthHelper.getToken;

@Service
@Transactional
public class LayerService {

    private final ProjectionFactory factory;
    private final ProjectService projectService;
    private final LayerRepository layerRepository;
    private final LayersService geoserverLayers;

    public LayerService(ProjectionFactory factory,
                        LayerRepository layerRepository,
                        ProjectService projectService) {
        this.factory = factory;
        this.projectService = projectService;
        this.layerRepository = layerRepository;

        this.geoserverLayers = new LayersService();
    }

    public List<LayerProjection> findAll(long projectId, Authentication authentication) {
        return projectService
                .getProjectionById(projectId, authentication)
                .getLayers();
    }

    public LayerProjection findById(long projectId, long layerId, Authentication authentication) {
        return projectService
                .getProjectionById(projectId, authentication)
                .getLayers().stream()
                .filter(layerProjection -> layerProjection.getId().equals(layerId))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Not found layer by id: " + layerId));
    }

    public LayerProjection create(long projectId, LayerCreateDto dto, Authentication authentication) {
        Project project = projectService.getById(projectId, authentication);

        Layer layer = createLayer(dto, project);

        return factory.createProjection(LayerProjection.class, layer);
    }

    public void update(long projectId, long layerId, @Valid LayerUpdateDto dto, Authentication authentication) {
        LayerProjection layerProjection = findById(projectId, layerId, authentication);

        layerRepository
                .findById(layerProjection.getId())
                .ifPresent(layer -> {
                    updateAttributes(layer, dto);

                    layerRepository.save(layer);
                });
    }

    public void delete(long projectId, long layerId, Authentication authentication) {
        Project project = projectService.getById(projectId, authentication);
        Layer layer = project.getLayers().stream()
                .filter(l -> layerId == l.getId())
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Not found layer with id: " + layerId));

        project.getLayers().remove(layer);

        layerRepository.delete(layer);

        try {
            geoserverLayers.delete(layer.getInternalName(), getToken(authentication));
        } catch (GeoserverClientException e) {
            throw new GisServiceException("Не удалось удалить слой с геосервера", e.getCause());
        }
    }

    @NotNull
    private Layer createLayer(LayerCreateDto dto, Project project) {
        if (layerRepository.findByInternalNameAndProject(dto.getInternalName(), project).isPresent()) {
            throw new ConflictException("Layer with same internalName already exist");
        }

        Layer newLayer = new Layer(dto);
        newLayer.setProject(project);

        return layerRepository.save(newLayer);
    }

    private void updateAttributes(Layer layer, LayerUpdateDto dto) {
        if (dto.getTitle() != null) {
            layer.setTitle(dto.getTitle());
        }

        if (dto.getStyleName() != null) {
            layer.setStyleName(dto.getStyleName());
        }

        if (dto.getTransparency() != -1) {
            layer.setTransparency(dto.getTransparency());
        }

        if (dto.getPosition() != -1) {
            layer.setPosition(dto.getPosition());
        }

        if (dto.getEnabled() != null) {
            layer.setEnabled(Boolean.parseBoolean(dto.getEnabled()));
        }

        layer.setLastModified(LocalDateTime.now());
    }
}
