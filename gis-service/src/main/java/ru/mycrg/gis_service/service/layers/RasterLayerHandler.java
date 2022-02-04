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
import ru.mycrg.gis_service.exceptions.ConflictException;
import ru.mycrg.gis_service.repository.LayerRepository;
import ru.mycrg.gis_service.security.AuthenticationFacade;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.util.Optional;

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
    public Optional<Layer> create(Project project, LayerCreateDto dto) throws HttpClientException {
        log.debug("Try create raster layer");

        String tableName = dto.getTableName();
        String type = dto.getType();

        if (!dto.isDummy() && layerRepository.findByTableNameAndProjectAndType(tableName, project, type).isPresent()) {
            throw new ConflictException("Уже существует растровый слой указывающий на таблицу: " + tableName);
        }

        String workspaceName = getScratchWorkspaceName(authenticationFacade.getOrganizationId());
        String accessToken = authenticationFacade.getRootAccessToken();

        createRasterStore(workspaceName, dto, accessToken);
        createRasterLayer(workspaceName, dto, accessToken);

        if (dto.isDummy()) {
            return Optional.empty();
        } else {
            Layer newLayer = layerRepository.save(new Layer(dto, project));

            return Optional.of(newLayer);
        }
    }

    private void createRasterStore(String workspaceName, LayerCreateDto dto, String accessToken)
            throws HttpClientException {
        ResponseModel<Object> response = new RasterStorage(accessToken)
                .createGeoTIFF(workspaceName, dto.getDataStoreName(), dto.getDataSourceUri());
        if (!response.isSuccessful() && !response.getBody().toString().contains("already exists in workspace")) {
            throw new IllegalStateException("Не удалось создать хранилище на геосервере");
        }
    }

    private void createRasterLayer(String workspaceName, LayerCreateDto dto, String accessToken)
            throws HttpClientException {
        ResponseModel<Object> response = new CoverageHandler(accessToken)
                .create(workspaceName,
                        dto.getDataStoreName(),
                        new CoverageModel(dto.getTableName(), dto.getTitle(), "28406", dto.getNativeCRS()));
        if (!response.isSuccessful() && !response.getBody().toString().contains("already exists in store")) {
            throw new IllegalStateException("Не удалось создать растровый слой на геосервере");
        }
    }

    @Override
    public String getType() {
        return "raster";
    }
}
