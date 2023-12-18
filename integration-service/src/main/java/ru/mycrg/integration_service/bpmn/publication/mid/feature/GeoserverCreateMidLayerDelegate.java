package ru.mycrg.integration_service.bpmn.publication.mid.feature;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import ru.mycrg.data_service_contract.queue.request.PlaceMidFileEvent;
import ru.mycrg.geoserver_client.contracts.featuretypes.FeatureTypeModel;
import ru.mycrg.geoserver_client.services.feature_types.FeatureTypeService;
import ru.mycrg.integration_service.bpmn.publication.dxf.feature.CreateFeatureDto;
import ru.mycrg.integration_service.bpmn.publication.dxf.gis_layer.DxfLayer;

import static org.springframework.util.StringUtils.stripFilenameExtension;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("geoserverCreateMidLayerDelegate")
public class GeoserverCreateMidLayerDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(GeoserverCreateMidLayerDelegate.class);

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        log.debug("execute geoserverCreateMidLayerDelegate");

        try {
            String token = (String) execution.getVariable(TOKEN_VAR_NAME);
            CreateFeatureDto dto = (CreateFeatureDto) execution.getVariable("CreateFeatureDto");
            PlaceMidFileEvent event = (PlaceMidFileEvent) execution.getVariable(EVENT_VAR_NAME);
            String filename = stripFilenameExtension(StringUtils.getFilename(event.getPathToFile()));
            String crs = event.getCrs();

            log.debug("Create feature based on MID file: [{}]", filename);

            FeatureTypeModel featureType = new FeatureTypeModel(dto.getFeatureName(),
                                                                filename,
                                                                crs);
            DxfLayer dxfLayer = new DxfLayer(event.getProjectId(),
                                             event.getFeatureName(),
                                             event.getLayerTitle(),
                                             crs,
                                             event.getLibraryId(),
                                             event.getRecordId(),
                                             "schema_mid",
                                             event.getStyleName(),
                                             event.getWorkspaceName());

            var response = new FeatureTypeService(token).create(dto.getWorkspaceName(),
                                                                dto.getStoreName(),
                                                                featureType);
            if (response.isSuccessful()) {
                log.debug("Successfully created MID feature with params: [{}]", dto);

                execution.setVariable(IS_CREATED_VAR_NAME, true);
                execution.setVariable("DxfLayer", dxfLayer);
            } else {
                String body = (String) response.getBody();
                if (body.contains("already exists")) {
                    log.debug("Feature: '{}' already exist", dto.getWorkspaceName());

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
            log.error("Failed to execute step: 'geoserverCreateMidLayerDelegate'. Cause: {}",
                      e.getMessage());

            execution.setVariable(IS_CREATED_VAR_NAME, false);
            execution.setVariable(FAIL_REASON, baseFailMsg());
        }
    }

    @NotNull
    private String baseFailMsg() {
        return "Не удалось создать MID слой на геосервере";
    }
}
