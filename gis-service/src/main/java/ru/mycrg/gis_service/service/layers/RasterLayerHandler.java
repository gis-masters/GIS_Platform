package ru.mycrg.gis_service.service.layers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.geoserver_client.services.layers.rasters.CoverageHandler;
import ru.mycrg.geoserver_client.services.layers.rasters.CoverageModel;
import ru.mycrg.geoserver_client.services.storage.raster.RasterStorage;
import ru.mycrg.gis_service.dto.LayerCreateDto;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.repository.LayerRepository;
import ru.mycrg.gis_service.security.CrgAuthHandler;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.util.Optional;

import static ru.mycrg.common_utils.CrgGlobalProperties.buildRasterStoreName;
import static ru.mycrg.common_utils.CrgGlobalProperties.getScratchWorkspaceName;
import static ru.mycrg.gis_service.service.geoserver.FeatureUtil.buildGeoserverFeatureName;

@Component
public class RasterLayerHandler implements ILayerHandler {

    private final Logger log = LoggerFactory.getLogger(RasterLayerHandler.class);

    private final LayerRepository layerRepository;
    private final CrgAuthHandler crgAuthHandler;
    private final IAuthenticationFacade authenticationFacade;

    public static final String FULL_MODE = "full";
    public static final String GEOSERVER_MODE = "geoserver";
    public static final String GIS_SERVICE_MODE = "gis-service";

    public RasterLayerHandler(LayerRepository layerRepository,
                              CrgAuthHandler crgAuthHandler,
                              IAuthenticationFacade authenticationFacade) {
        this.layerRepository = layerRepository;
        this.crgAuthHandler = crgAuthHandler;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public String getType() {
        return "raster";
    }

    @Override
    public Optional<Layer> create(Project project, LayerCreateDto dto) {
        String storeName = dto.getDataset();
        String workspaceName = null;

        if (!GIS_SERVICE_MODE.equals(dto.getMode())) {
            Long orgId = authenticationFacade.getOrganizationId();
            workspaceName = getScratchWorkspaceName(orgId);
            String nativeCRS = dto.getNativeCRS() != null ? dto.getNativeCRS() : defaultEpsgCode();
            String tableName = buildGeoserverFeatureName(dto.getTableName(), nativeCRS);
            if (storeName == null) {
                storeName = buildRasterStoreName(dto.getTableName());
            }

            CoverageModel coverage = new CoverageModel(tableName,
                                                       dto.getTitle(),
                                                       nativeCRS,
                                                       dto.getNativeCRS());

            try {
                createRasterStore(workspaceName, storeName, dto.getDataSourceUri());
                createRasterLayer(workspaceName, storeName, coverage);
            } catch (Exception e) {
                log.error("Не удалось создать растровые хранилище/слой на геосервере. По причине: {}", e.getMessage());

                return Optional.empty();
            }
        }

        if (GEOSERVER_MODE.equals(dto.getMode())) {
            return Optional.empty();
        } else {
            Layer layer = new Layer(dto, project);
            layer.setDataset(storeName);
            layer.setDataStoreName(workspaceName);

            Layer newLayer = layerRepository.save(layer);

            return Optional.of(newLayer);
        }
    }

    private void createRasterStore(String workspaceName,
                                   String store,
                                   String path) throws HttpClientException {
        String accessToken = crgAuthHandler.getRootAccessToken();

        ResponseModel<Object> response = new RasterStorage(accessToken).createGeoTIFF(workspaceName, store, path);
        if (!response.isSuccessful() && !response.getBody().toString().contains("already exists")) {
            throw new IllegalStateException("Не удалось создать хранилище на геосервере");
        }
    }

    private void createRasterLayer(String workspaceName,
                                   String store,
                                   CoverageModel coverage) throws HttpClientException {
        String accessToken = crgAuthHandler.getRootAccessToken();

        ResponseModel<Object> response = new CoverageHandler(accessToken).create(workspaceName, store, coverage);
        if (!response.isSuccessful() && !response.getBody().toString().contains("already exists")) {
            throw new IllegalStateException("Не удалось создать растровый слой на геосервере");
        }
    }
}
