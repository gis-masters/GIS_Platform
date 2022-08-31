package ru.mycrg.gis_service.service.layers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.geoserver_client.services.layers.rasters.CoverageHandler;
import ru.mycrg.geoserver_client.services.layers.rasters.CoverageModel;
import ru.mycrg.geoserver_client.services.storage.raster.RasterStorage;
import ru.mycrg.gis_service.dto.LayerCreateDto;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.repository.LayerRepository;
import ru.mycrg.gis_service.security.AuthenticationFacade;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.util.Optional;

import static ru.mycrg.common_utils.CrgGlobalProperties.buildRasterStoreName;
import static ru.mycrg.common_utils.CrgGlobalProperties.getScratchWorkspaceName;

@Component
public class RasterLayerHandler implements ILayerHandler {

    private final Logger log = LoggerFactory.getLogger(RasterLayerHandler.class);

    private final LayerRepository layerRepository;
    private final AuthenticationFacade authenticationFacade;

    public static final String FULL_MODE = "full";
    public static final String GEOSERVER_MODE = "geoserver";

    public RasterLayerHandler(LayerRepository layerRepository,
                              AuthenticationFacade authenticationFacade) {
        this.layerRepository = layerRepository;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public String getType() {
        return "raster";
    }

    @Override
    public Optional<Layer> create(Project project, LayerCreateDto dto) throws HttpClientException {
        log.debug("Try create raster layer");

        if (FULL_MODE.equals(dto.getMode()) || GEOSERVER_MODE.equals(dto.getMode())) {
            String tableName = dto.getTableName();
            String workspaceName = getScratchWorkspaceName(authenticationFacade.getOrganizationId());
            String storeName = buildRasterStoreName(tableName);
            CoverageModel coverage = new CoverageModel(dto.getTableName(), dto.getTitle(), "28406", dto.getNativeCRS());

            createRasterStore(workspaceName, storeName, dto.getDataSourceUri());
            createRasterLayer(workspaceName, storeName, coverage);
        }

        if (GEOSERVER_MODE.equals(dto.getMode())) {
            return Optional.empty();
        } else {
            Layer newLayer = layerRepository.save(new Layer(dto, project));

            return Optional.of(newLayer);
        }
    }

    private void createRasterStore(String workspaceName,
                                   String store,
                                   String path) throws HttpClientException {
        String accessToken = authenticationFacade.getRootAccessToken();

        ResponseModel<Object> response = new RasterStorage(accessToken).createGeoTIFF(workspaceName, store, path);

        if (!response.isSuccessful() && !response.getBody().toString().contains("already exists in workspace")) {
            throw new IllegalStateException("Не удалось создать хранилище на геосервере");
        }
    }

    private void createRasterLayer(String workspaceName, String store, CoverageModel coverage)
            throws HttpClientException {
        String accessToken = authenticationFacade.getRootAccessToken();

        ResponseModel<Object> response = new CoverageHandler(accessToken)
                .create(workspaceName, store, coverage);

        if (!response.isSuccessful() && !response.getBody().toString().contains("already exists in store")) {
            throw new IllegalStateException("Не удалось создать растровый слой на геосервере");
        }
    }
}
