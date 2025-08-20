package ru.mycrg.gis_service.service.resource_analyze.queries;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.service.layers.LayerService;
import ru.mycrg.gis_service.service.projects.ProjectService;
import ru.mycrg.resource_analyzer_contract.IResource;
import ru.mycrg.resource_analyzer_contract.IResourceDefinition;
import ru.mycrg.resource_analyzer_contract.IResourceQueryService;
import ru.mycrg.resource_analyzer_contract.impl.Resource;
import ru.mycrg.resource_analyzer_contract.impl.ResourceDefinition;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RasterLayerQuery implements IResourceQueryService {

    private final String layerType = "raster";

    private final LayerService layerService;
    private final ProjectService projectService;
    private final ResourceDefinition resourceDefinition;

    public RasterLayerQuery(ProjectService projectService, LayerService layerService) {
        this.layerService = layerService;
        this.projectService = projectService;

        resourceDefinition = new ResourceDefinition("RasterLayer", "Растровые слои");
    }

    public Page<IResource> getResources(Pageable pageable) {
        List<Project> projects = projectService.getAll();

        return layerService.getUniqueLayers(layerType, projects, pageable)
                           .map(this::mapLayerToResource);
    }

    @Override
    public IResourceDefinition getResourceDefinition() {
        return resourceDefinition;
    }

    private IResource mapLayerToResource(Layer layer) {
        final Map<String, Object> resProps = new HashMap<>();
        resProps.put("styleName", layer.getStyleName());
        resProps.put("type", layer.getType());

        return new Resource(layer.getTableName(), layer.getTitle(), resourceDefinition, resProps);
    }
}
