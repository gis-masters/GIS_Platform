package ru.mycrg.integration_service.bpmn.fiz.geoserver_feature;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StopWatch;
import ru.mycrg.data_service_contract.queue.request.PlaceDxfFileEvent;
import ru.mycrg.geoserver_client.contracts.featuretypes.FeatureTypeModel;
import ru.mycrg.geoserver_client.services.feature_types.FeatureTypeService;
import ru.mycrg.integration_service.bpmn.fiz.gis_layer.DxfLayer;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("geoserverCreateDxfLayerDelegate")
public class GeoserverCreateDxfLayerDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(GeoserverCreateDxfLayerDelegate.class);

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        log.debug("execute geoserverCreateDxfLayerDelegate");

        StopWatch watch = new StopWatch();
        try {
            String token = (String) execution.getVariable(TOKEN_VAR_NAME);
            CreateFeatureDto dto = (CreateFeatureDto) execution.getVariable("CreateFeatureDto");
            PlaceDxfFileEvent event = (PlaceDxfFileEvent) execution.getVariable(EVENT_VAR_NAME);
            log.debug("CreateFeatureDto: [{}]", dto);

            FeatureTypeModel featureType = new FeatureTypeModel(dto.getFeatureName(), event.getCrs(), true);
            DxfLayer dxfLayer = new DxfLayer(event.getProjectId(),
                                             event.getFeatureName(),
                                             event.getLayerTitle(),
                                             event.getCrs(),
                                             event.getLibraryId(),
                                             event.getRecordId());

            watch.start("create FeatureTypeService");
            log.debug("before");
            var response = new FeatureTypeService(token).create(dto.getWorkspaceName(),
                                                                dto.getStoreName(),
                                                                featureType);
            log.debug("after");
            if (response.isSuccessful()) {
                log.debug("Successfully created DXF feature with params: [{}]", dto);

                execution.setVariable(IS_CREATED_VAR_NAME, true);
                execution.setVariable("DxfLayer", dxfLayer);
            } else {
                String body = (String) response.getBody();
                if (body.contains("already exists")) {
                    log.debug("Store: '{}' already exist", dto.getWorkspaceName());

                    execution.setVariable(IS_CREATED_VAR_NAME, true);
                    execution.setVariable("DxfLayer", dxfLayer);
                } else {
                    String failMsg = baseFailMsg();
                    log.error("{}. With params: [{}]. Response code: {}", failMsg, dto, response.getCode());

                    execution.setVariable(IS_CREATED_VAR_NAME, false);
                    execution.setVariable(FAIL_REASON, failMsg);
                }
            }
        } catch (Exception e) {
            log.error("Failed to execute step: 'geoserverCreateDxfLayerDelegate'. Cause: {}",
                      e.getMessage());

            execution.setVariable(IS_CREATED_VAR_NAME, false);
            execution.setVariable(FAIL_REASON, baseFailMsg());
        } finally {
            watch.stop();
            log.debug("End: {}", watch.prettyPrint());
        }
    }

    @NotNull
    private String baseFailMsg() {
        return "Не удалось создать DXF слой на геосервере";
    }
}
