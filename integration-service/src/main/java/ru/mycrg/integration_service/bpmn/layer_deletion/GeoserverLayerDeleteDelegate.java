package ru.mycrg.integration_service.bpmn.layer_deletion;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.geoserver_client.services.storage.raster.RasterStorage;
import ru.mycrg.http_client.ResponseModel;

import static ru.mycrg.common_utils.CrgGlobalProperties.buildRasterStoreName;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.LAYER_COMPLEX_NAME;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.TOKEN_VAR_NAME;

@Service("geoserverLayerDeleteDelegate")
public class GeoserverLayerDeleteDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(GeoserverLayerDeleteDelegate.class);

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final String accessToken = execution.getVariable(TOKEN_VAR_NAME).toString();
        final String layerName = execution.getVariable(LAYER_COMPLEX_NAME).toString();

        deleteLayerOnGeoserver(layerName, accessToken);
    }

    private void deleteLayerOnGeoserver(String complexLayerName, String token) {
        try {
            log.debug("Try delete layer references: {}", complexLayerName);

            final String workspaceName = complexLayerName.split(":")[0];
            final String layerName = complexLayerName.split(":")[1];
            final String coverageStore = buildRasterStoreName(layerName);

            ResponseModel<Object> response = new RasterStorage(token).delete(workspaceName, coverageStore, true);
            if (!response.isSuccessful()) {
                log.error("Failed remove layer from geoserver: {}", complexLayerName);
            }
        } catch (Exception e) {
            log.error("Failed remove layer from geoserver: {} / Cause: {}", complexLayerName,
                      e.getCause().getMessage());
        }
    }
}
