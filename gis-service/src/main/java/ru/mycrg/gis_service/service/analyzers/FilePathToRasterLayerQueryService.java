package ru.mycrg.gis_service.service.analyzers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.layers.LayerUtils;
import ru.mycrg.geoserver_client.services.layers.LayersService;
import ru.mycrg.geoserver_client.services.layers.models.Layer;
import ru.mycrg.geoserver_client.services.storage.raster.RasterStorage;
import ru.mycrg.geoserver_client.services.storage.raster.RasterStorageUtils;
import ru.mycrg.gis_service.dto.LayerProjection;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.security.CrgAuthHelper;
import ru.mycrg.gis_service.security.IAuthenticationFacade;
import ru.mycrg.gis_service.service.LayerService;
import ru.mycrg.gis_service.service.ProjectService;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.resource_analyzer_contract.*;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class FilePathToRasterLayerQueryService implements IResourceQueryService {

    public static final Logger log = LoggerFactory.getLogger(FilePathToRasterLayerQueryService.class);

    private final ProjectService projectService;
    private final LayerService layerService;
    private final IResourceDefinition resourceDefinition =
            new ResourceDefinitionImpl("FilePathToRasterLayer", "Путь к растровому файлу");
    private final IAuthenticationFacade authenticationFacade;

    public FilePathToRasterLayerQueryService(ProjectService projectService,
                                             LayerService layerService,
                                             IAuthenticationFacade authenticationFacade) {

        this.projectService = projectService;
        this.layerService = layerService;
        this.authenticationFacade = authenticationFacade;
    }

    public List<IResource> getResources() {
        List<ResourceImpl> layerResources = new ArrayList<>();
        Set<Long> projectIds = projectService.getAll().stream()
                                             .map(Project::getId)
                                             .collect(Collectors.toSet());

        projectIds.forEach(projectId -> layerResources.addAll(
                layerService.findAll(projectId).stream()
                            .filter(lp -> lp.getType().equals("raster"))
                            .map(this::mapLayerToResource)
                            .flatMap(Optional::stream)
                            .collect(Collectors.toList())));

        return Collections.unmodifiableList(layerResources);
    }

    @Override
    public IResourceDefinition getResourceDefinition() {
        return resourceDefinition;
    }

    private Optional<ResourceImpl> mapLayerToResource(LayerProjection layerProjection) {
        String token = CrgAuthHelper.getToken(authenticationFacade.getAuthentication());

        LayersService geoserverLayerService = new LayersService(token);
        RasterStorage geoserverRasterStorage = new RasterStorage(token);
        Layer layer;
        String path = "";
        try {
            layer = geoserverLayerService.getByName(layerProjection.getTableName())
                                         .orElseThrow(() -> new NotFoundException(layerProjection.getTableName()));

            String href = layer.getResource().getHref();
            String workspaceName = LayerUtils.getWorkspaceName(href);
            String coverageStoreName = LayerUtils.getCoverageStoreName(href);

            path = getRasterFilePath(geoserverRasterStorage, workspaceName, coverageStoreName);
        } catch (Exception e) {
            log.warn("something went wrong when getting path for raster layer {}", layerProjection.getTableName());
            return Optional.empty();
        }

        String finalPath = path;
        return Optional.of(new ResourceImpl(layerProjection.getTitle(),
                                            layerProjection.getTableName(),
                                            new ResourceDefinitionImpl("FilePathToRasterLayer",
                                                                       "Путь к растровому файлу"),
                                            new HashMap<String, Object>() {{
                                                this.put("path", finalPath);
                                            }}));
    }

    private String getRasterFilePath(RasterStorage geoserverRasterStorage,
                                     String workspaceName,
                                     String coverageStoreName) throws HttpClientException {
        String fullUrl = geoserverRasterStorage.getStorage(workspaceName, coverageStoreName)
                                               .getBody()
                                               .getCoverageStore()
                                               .getUrl();

        return RasterStorageUtils.getFilePath(fullUrl);
    }
}
