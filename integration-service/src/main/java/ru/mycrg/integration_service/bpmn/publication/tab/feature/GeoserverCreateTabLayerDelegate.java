package ru.mycrg.integration_service.bpmn.publication.tab.feature;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import ru.mycrg.data_service_contract.queue.request.PlaceTabFileEvent;
import ru.mycrg.geoserver_client.contracts.featuretypes.FeatureTypeModel;
import ru.mycrg.geoserver_client.services.feature_types.FeatureTypeService;
import ru.mycrg.integration_service.bpmn.publication.dxf.feature.CreateFeatureDto;
import ru.mycrg.integration_service.bpmn.publication.dxf.gis_layer.DxfLayer;

import static org.springframework.util.StringUtils.stripFilenameExtension;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("geoserverCreateTabLayerDelegate")
public class GeoserverCreateTabLayerDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(GeoserverCreateTabLayerDelegate.class);

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        log.debug("execute geoserverCreateTabLayerDelegate");

        try {
            String token = (String) execution.getVariable(TOKEN_VAR_NAME);
            CreateFeatureDto dto = (CreateFeatureDto) execution.getVariable("CreateFeatureDto");
            PlaceTabFileEvent event = (PlaceTabFileEvent) execution.getVariable(EVENT_VAR_NAME);
            String filename = stripFilenameExtension(StringUtils.getFilename(event.getPathToFile()));
            String crs = event.getCrs();

            log.debug("Create feature based on TAB file: [{}]", filename);

            FeatureTypeModel featureType = new FeatureTypeModel(dto.getFeatureName(),
                                                                filename,
                                                                crs);
            DxfLayer dxfLayer = new DxfLayer(event.getProjectId(),
                                             event.getFeatureName(),
                                             event.getLayerTitle(),
                                             crs,
                                             event.getLibraryId(),
                                             event.getRecordId(),
                                             "schema_tab",
                                             event.getStyleName(),
                                             event.getWorkspaceName());

            var response = new FeatureTypeService(token).create(dto.getWorkspaceName(),
                                                                dto.getStoreName(),
                                                                featureType);
            if (response.isSuccessful()) {
                log.debug("Successfully created TAB feature with params: [{}]", dto);

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
            log.error("Failed to execute step: 'geoserverCreateTabLayerDelegate'. Cause: {}",
                      e.getMessage());

            execution.setVariable(IS_CREATED_VAR_NAME, false);
            execution.setVariable(FAIL_REASON, baseFailMsg());
        }
    }

    @NotNull
    private String baseFailMsg() {
        return "Не удалось создать TAB слой на геосервере";
    }
}
