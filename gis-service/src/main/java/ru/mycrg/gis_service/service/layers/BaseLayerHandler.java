package ru.mycrg.gis_service.service.layers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.gis_service.dto.LayerCreateDto;
import ru.mycrg.gis_service.entity.Layer;
import ru.mycrg.gis_service.entity.Project;
import ru.mycrg.gis_service.exceptions.NotFoundException;
import ru.mycrg.gis_service.repository.LayerRepository;
import ru.mycrg.gis_service.service.geoserver.LayerGeoserverService;

import java.util.Optional;

import static ru.mycrg.common_utils.CrgGlobalProperties.buildGeoserverComplexLayerName;
import static ru.mycrg.common_utils.CrgGlobalProperties.getScratchWorkspaceName;
import static ru.mycrg.gis_service.service.geoserver.FeatureUtil.buildGeoserverFeatureName;
import static ru.mycrg.gis_service.service.layers.RasterLayerHandler.*;

@Component
public class BaseLayerHandler implements ILayerHandler {

    private final Logger log = LoggerFactory.getLogger(BaseLayerHandler.class);

    private final LayerRepository layerRepository;
    private final IAuthenticationFacade authenticationFacade;
    private final LayerGeoserverService layerGeoserverService;

    public BaseLayerHandler(LayerRepository layerRepository,
                            IAuthenticationFacade authenticationFacade,
                            LayerGeoserverService layerGeoserverService) {
        this.layerRepository = layerRepository;
        this.authenticationFacade = authenticationFacade;
        this.layerGeoserverService = layerGeoserverService;
    }

    @Transactional
    public Optional<Layer> create(Project project, LayerCreateDto dto) {
        String mode = getMode(dto);

        Layer newLayer = new Layer(dto);
        newLayer.setProject(project);
        String requestedTableName = newLayer.getTableName();
        String nativeCRS = newLayer.getNativeCRS() != null ? newLayer.getNativeCRS() : defaultEpsgCode();

        log.info("BaseLayerHandler.create: {}", newLayer);
        log.info("BaseLayerHandler.requestedTableName: {} / mode: {}", requestedTableName, mode);

        Layer layer = null;
        if (FULL_MODE.equals(mode) || GIS_SERVICE_MODE.equals(mode)) {
            if (layerRepository.existsByProjectAndTableNameAndNativeCRS(project, requestedTableName, nativeCRS)) {
                log.debug("Слой: '{} / {} / {}' уже существует", project.getId(), requestedTableName, nativeCRS);

                layer = layerRepository
                        .findByTableNameAndNativeCRS(requestedTableName, nativeCRS)
                        .stream().findFirst()
                        .orElseThrow(() -> new NotFoundException(
                                String.format("Не найден слой: %s / %s", requestedTableName, nativeCRS)));
            } else {
                layer = layerRepository.save(newLayer);
            }
        }

        if (FULL_MODE.equals(mode) || GEOSERVER_MODE.equals(mode)) {
            String requestedFeatureTypeName = dto.getFeatureTypeName();
            String featureTypeName = requestedFeatureTypeName == null
                    ? buildGeoserverFeatureName(requestedTableName, nativeCRS)
                    : buildGeoserverFeatureName(requestedFeatureTypeName, nativeCRS);

            String requestedNativeName = dto.getNativeName();
            String nativeName = requestedNativeName != null
                    ? requestedNativeName
                    : requestedTableName;

            Optional<String> oFeatureTypeName = layerGeoserverService.create(newLayer, featureTypeName, nativeName);
            if (oFeatureTypeName.isPresent()) {
                String workspace = newLayer.getDataStoreName();
                if (workspace == null) {
                    workspace = getScratchWorkspaceName(authenticationFacade.getOrganizationId());
                }

                layerGeoserverService.associateStyle(buildGeoserverComplexLayerName(workspace, oFeatureTypeName.get()),
                                                     newLayer.getStyleName());
            } else {
                if (layer != null) {
                    log.debug("Не удалось создать слой на геосервере, выполняем откат - удаляем слой: {}", newLayer);

                    layerRepository.deleteLayerById(layer.getId());
                }
            }
        }

        return Optional.ofNullable(layer);
    }

    @Override
    public String getType() {
        return null;
    }
}
