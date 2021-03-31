package ru.mycrg.gis_service.service.analyzer;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import ru.mycrg.gis_service.dto.LayerProjection;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.service.LayerService;
import ru.mycrg.gis_service.service.ProjectService;
import ru.mycrg.resource_analyzer_contract.*;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class VectorLayerQueryService implements IResourceQueryService {

    final ProjectService projectService;
    final LayerService layerService;
    final IResourceDefinition resourceDefinition = new ResourceDefinitionImpl("VectorLayer", "Векторный слой");

    public VectorLayerQueryService(ProjectService projectService, LayerService layerService) {
        this.projectService = projectService;
        this.layerService = layerService;
    }

    public List<IResource> getResources() {
        List<ResourceImpl> vectorLayerResources = new ArrayList<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        Set<Long> projectIds = projectService.getAll(authentication).stream()
                                             .map(Project::getId)
                                             .collect(Collectors.toSet());

        projectIds.forEach(projectId -> {
            vectorLayerResources.addAll(layerService.findAll(projectId, authentication).stream()
                                                    .filter(lp -> "vector".equals(lp.getType()))
                                                    .map(VectorLayerQueryService::mapToCheckVectorLayerToResource)
                                                    .collect(Collectors.toList()));
        });

        return Collections.unmodifiableList(vectorLayerResources);
    }

    private static ResourceImpl mapToCheckVectorLayerToResource(LayerProjection lp) {
        return new ResourceImpl(lp.getTitle(),
                                lp.getTableName(),
                                new ResourceDefinitionImpl("VectorLayer", "Векторный слой"),
                                new HashMap<String, Object>() {{
                                    this.put("styleName", lp.getStyleName());
                                }});
    }

    @Override
    public IResourceDefinition getResourceDefinition() {
        return resourceDefinition;
    }
}
