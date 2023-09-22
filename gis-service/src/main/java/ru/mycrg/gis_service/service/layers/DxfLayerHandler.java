package ru.mycrg.gis_service.service.layers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.geoserver_client.services.styles.StyleService;
import ru.mycrg.gis_service.dto.LayerCreateDto;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.repository.LayerRepository;
import ru.mycrg.gis_service.security.CrgAuthHandler;
import ru.mycrg.gis_service.service.geoserver.LayerGeoserverService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.util.Optional;

import static java.util.Objects.nonNull;
import static ru.mycrg.common_utils.CrgGlobalProperties.getScratchWorkspaceName;

@Component
public class DxfLayerHandler implements ILayerHandler {

    private final Logger log = LoggerFactory.getLogger(DxfLayerHandler.class);

    private final LayerRepository layerRepository;
    private final CrgAuthHandler crgAuthHandler;
    private final LayerGeoserverService layerGeoserverService;
    private final IAuthenticationFacade authenticationFacade;

    public DxfLayerHandler(LayerRepository layerRepository,
                           LayerGeoserverService layerGeoserverService,
                           CrgAuthHandler crgAuthHandler,
                           IAuthenticationFacade authenticationFacade) {
        this.layerRepository = layerRepository;
        this.layerGeoserverService = layerGeoserverService;
        this.crgAuthHandler = crgAuthHandler;
        this.authenticationFacade = authenticationFacade;
    }

    @Override
    public Optional<Layer> create(Project project, LayerCreateDto dto) {
        log.debug("DXF create");

        Layer newLayer = new Layer(dto);
        newLayer.setProject(project);

        Layer savedLayer = layerRepository.save(newLayer);

        try {
            log.debug("Check layer on geoserver by {}:{}", savedLayer.getDataStoreName(), savedLayer.getTableName());

            boolean existOnGeoserver = layerGeoserverService.isLayerExist(savedLayer.getDataStoreName(),
                                                                          savedLayer.getTableName());
            if (!existOnGeoserver) {
                log.debug("layer not exist");

                ResponseModel<Object> responseModel = layerGeoserverService.createLayer(savedLayer);
                if (responseModel.isSuccessful()) {
                    associateStyle(savedLayer);
                } else {
                    String msg = nonNull(responseModel.getBody())
                            ? responseModel.getBody().toString()
                            : "Не удалось создать слой на геосервере";

                    log.error(msg);

                    throw new BadRequestException(msg);
                }
            } else {
                log.debug("Layer already exist.");

                associateStyle(savedLayer);
            }
        } catch (HttpClientException e) {
            String msg = String.format("Не удалось опубликовать слой %s на геосервере. Reason: %s",
                                       savedLayer.getTableName(), e.getMessage());
            log.error(msg);

            throw new BadRequestException(msg);
        }

        return Optional.of(savedLayer);
    }

    @Override
    public String getType() {
        return "dxf";
    }

    private void associateStyle(Layer layer) {
        log.debug("Add style: {} to layer: {}", layer.getStyleName(), layer.getTableName());

        Long orgId = authenticationFacade.getOrganizationId();

        try {
            ResponseModel<Object> response = new StyleService(crgAuthHandler.getRootAccessToken())
                    .associate(getScratchWorkspaceName(orgId) + ":" + layer.getTableName(), layer.getStyleName());
            if (!response.isSuccessful()) {
                log.warn("Style not associated: {}", response);
            }
        } catch (Exception e) {
            log.warn("Не удалось прикрепить стиль к слою: {}", layer.getTableName(), e);
        }
    }
}
