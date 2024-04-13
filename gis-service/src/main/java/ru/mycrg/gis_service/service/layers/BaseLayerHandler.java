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
        String mode = dto.getMode();
        if (mode == null) {
            mode = FULL_MODE;
        }

        if (dto.getTableName() == null || dto.getNativeCRS() == null) {
            return Optional.empty();
        }

        Layer newLayer = new Layer(dto);
        newLayer.setProject(project);
        String tableName = newLayer.getTableName();
        String nativeCRS = newLayer.getNativeCRS() != null ? newLayer.getNativeCRS() : defaultEpsgCode();

        Layer layer = null;
        if (!GEOSERVER_MODE.equals(mode)) {
            if (layerRepository.existsByProjectAndTableNameAndNativeCRS(project, tableName, nativeCRS)) {
                log.debug("Слой: '{} / {} / {}' уже существует", project.getId(), tableName, nativeCRS);

                layer = layerRepository
                        .findByTableNameAndNativeCRS(tableName, nativeCRS)
                        .stream().findFirst()
                        .orElseThrow(() -> new NotFoundException(
                                String.format("Не найден слой: %s / %s", tableName, nativeCRS)));
            } else {
                layer = layerRepository.save(newLayer);
            }
        }

        if (!GIS_SERVICE_MODE.equals(mode)) {
            String featureTypeName = dto.getFeatureTypeName() == null
                    ? buildGeoserverFeatureName(tableName, nativeCRS)
                    : buildGeoserverFeatureName(dto.getFeatureTypeName(), nativeCRS);

            String nativeName = dto.getNativeName() != null
                    ? dto.getNativeName()
                    : dto.getTableName();
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
