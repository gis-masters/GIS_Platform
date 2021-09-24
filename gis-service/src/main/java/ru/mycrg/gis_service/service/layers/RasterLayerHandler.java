package ru.mycrg.gis_service.service.layers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.geoserver_client.services.layers.rasters.CoverageModel;
import ru.mycrg.geoserver_client.services.layers.rasters.CoverageHandler;
import ru.mycrg.geoserver_client.services.storage.raster.RasterStorage;
import ru.mycrg.gis_service.dto.LayerCreateDto;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.ConflictException;
import ru.mycrg.gis_service.repository.LayerRepository;
import ru.mycrg.gis_service.security.AuthenticationFacade;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import static java.lang.Thread.sleep;
import static ru.mycrg.common_utils.CrgGlobalProperties.getScratchWorkspaceName;

@Component
public class RasterLayerHandler implements ILayerHandler {

    public final Logger log = LoggerFactory.getLogger(RasterLayerHandler.class);

    private final LayerRepository layerRepository;
    private final AuthenticationFacade authenticationFacade;

    public RasterLayerHandler(LayerRepository layerRepository,
                              AuthenticationFacade authenticationFacade) {
        this.layerRepository = layerRepository;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public Layer create(Project project, LayerCreateDto dto) throws HttpClientException {
        log.debug("Try create raster layer");

        if (layerRepository.findByTableNameAndProjectAndType(dto.getTableName(), project, dto.getType()).isPresent()) {
            throw new ConflictException("Raster layer with same tableName already exist");
        }

        String workspaceName = getScratchWorkspaceName(authenticationFacade.getOrganizationId());
        String accessToken = authenticationFacade.getRootAccessToken();

        createRasterStore(workspaceName, dto, accessToken);
        createRasterLayer(workspaceName, dto, accessToken);

        return layerRepository.save(new Layer(dto, project));
    }

    private void createRasterStore(String workspaceName, LayerCreateDto dto, String accessToken)
            throws HttpClientException {
        ResponseModel<Object> response = new RasterStorage(accessToken)
                .createGeoTIFF(workspaceName, dto.getDataStoreName(), dto.getDataSourceUri());
        if (!response.isSuccessful()) {
            throw new IllegalStateException("Не удалось создать хранилище на геосервере");
        }
    }

    private void createRasterLayer(String workspaceName, LayerCreateDto dto, String accessToken)
            throws HttpClientException {
        ResponseModel<Object> response = new CoverageHandler(accessToken)
                .create(workspaceName,
                        dto.getDataStoreName(),
                        new CoverageModel(dto.getTableName(), dto.getTitle(), "28406", dto.getNativeCRS()));
        if (!response.isSuccessful()) {
            throw new IllegalStateException("Не удалось создать растровый слой на геосервере");
        }
    }

    @Override
    public String getType() {
        return "raster";
    }
}
