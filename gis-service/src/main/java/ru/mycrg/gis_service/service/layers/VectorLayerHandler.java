package ru.mycrg.gis_service.service.layers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import ru.mycrg.geoserver_client.services.styles.StyleService;
import ru.mycrg.gis_service.dto.LayerCreateDto;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.BadRequestException;
import ru.mycrg.gis_service.exceptions.ConflictException;
import ru.mycrg.gis_service.repository.LayerRepository;
import ru.mycrg.gis_service.security.AuthenticationFacade;
import ru.mycrg.gis_service.service.geoserver.LayerGeoserverService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.util.Objects;
import java.util.Optional;

import static ru.mycrg.gis_service.service.layers.LayerService.DATA_SERVICE_API_PREFIX;

@Component
public class VectorLayerHandler implements ILayerHandler {

    private final Logger log = LoggerFactory.getLogger(VectorLayerHandler.class);

    private final LayerRepository layerRepository;
    private final AuthenticationFacade authenticationFacade;
    private final LayerGeoserverService layerGeoserverService;

    public VectorLayerHandler(LayerRepository layerRepository,
                              AuthenticationFacade authenticationFacade,
                              LayerGeoserverService layerGeoserverService) {
        this.layerRepository = layerRepository;
        this.authenticationFacade = authenticationFacade;
        this.layerGeoserverService = layerGeoserverService;
    }

    @Override
    public Optional<Layer> create(Project project, LayerCreateDto dto) {
        log.debug("VectorLayerHandler create");

        if (layerRepository.findByTableNameAndProjectAndType(dto.getTableName(), project, dto.getType()).isPresent()) {
            throw new ConflictException("Vector layer with same tableName already exist");
        }

        Layer newLayer = new Layer(dto);
        newLayer.setProject(project);
        newLayer.setDataSourceUri(String.format("%s/datasets/%s/tables/%s",
                                                DATA_SERVICE_API_PREFIX, dto.getDataset(), dto.getTableName()));

        Layer savedLayer = layerRepository.save(newLayer);

        try {
            boolean existOnGeoserver = layerGeoserverService.isLayerExist(savedLayer.getDataStoreName(),
                                                                          savedLayer.getTableName());
            if (!existOnGeoserver) {
                ResponseModel<Object> responseModel = layerGeoserverService.createLayer(savedLayer);
                if (responseModel.isSuccessful()) {
                    associateStyle(savedLayer);
                } else {
                    String msg = Objects.nonNull(responseModel.getBody())
                            ? responseModel.getBody().toString()
                            : "Не удалось создать слой на геосервере";

                    log.error(msg);
                    throw new BadRequestException(msg);
                }
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
        return "vector";
    }

    private void associateStyle(Layer layer) {
        log.debug("Add style: {} to layer: {}", layer.getStyleName(), layer.getTableName());
        try {
            ResponseModel<Object> response = new StyleService(authenticationFacade.getRootAccessToken())
                    .associate(layer.getDataStoreName() + ":" + layer.getTableName(), layer.getStyleName());
            if (!response.isSuccessful()) {
                log.warn("Style not associated: {}", response);
            }
        } catch (Exception e) {
            String msg = "Не удалось прикрепить стиль к слою: " + layer.getTableName();
            log.error(msg, e);
        }
    }
}
