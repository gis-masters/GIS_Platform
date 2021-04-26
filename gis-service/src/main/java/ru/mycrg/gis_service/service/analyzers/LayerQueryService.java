package ru.mycrg.gis_service.service.analyzers;

import org.springframework.stereotype.Service;
import ru.mycrg.gis_service.dto.LayerProjection;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.service.LayerService;
import ru.mycrg.gis_service.service.ProjectService;
import ru.mycrg.resource_analyzer_contract.*;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class LayerQueryService implements IResourceQueryService {

    private final ProjectService projectService;
    private final LayerService layerService;
    private final IResourceDefinition resourceDefinition = new ResourceDefinitionImpl("Layer", "Слой");

    public LayerQueryService(ProjectService projectService, LayerService layerService) {
        this.projectService = projectService;
        this.layerService = layerService;
    }

    public List<IResource> getResources() {
        List<ResourceImpl> layerResources = new ArrayList<>();
        Set<Long> projectIds = projectService.getAll().stream()
                                             .map(Project::getId)
                                             .collect(Collectors.toSet());

        projectIds.forEach(projectId -> layerResources.addAll(
                layerService.findAll(projectId).stream()
                            .map(this::mapLayerToResource)
                            .collect(Collectors.toList())));

        return Collections.unmodifiableList(layerResources);
    }

    @Override
    public IResourceDefinition getResourceDefinition() {
        return resourceDefinition;
    }

    private ResourceImpl mapLayerToResource(LayerProjection lp) {
        return new ResourceImpl(lp.getTitle(),
                                lp.getTableName(),
                                new ResourceDefinitionImpl("Layer", "Слой"),
                                new HashMap<String, Object>() {{
                                    this.put("styleName", lp.getStyleName());
                                    this.put("type", lp.getType());
                                }});
    }
}
