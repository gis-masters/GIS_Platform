package ru.mycrg.integration_service.bpmn.publication.dxf.store;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.PlaceDxfFileEvent;
import ru.mycrg.geoserver_client.contracts.datastores.DxfDataStore;
import ru.mycrg.geoserver_client.services.storage.vector.VectorStorage;
import ru.mycrg.integration_service.bpmn.publication.dxf.feature.CreateFeatureDto;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("geoserverCreateDxfStoreDelegate")
public class GeoserverCreateDxfStoreDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(GeoserverCreateDxfStoreDelegate.class);

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        log.debug("execute GeoserverCreateDxfStoreDelegate");

        try {
            String token = (String) execution.getVariable(TOKEN_VAR_NAME);
            PlaceDxfFileEvent event = (PlaceDxfFileEvent) execution.getVariable(EVENT_VAR_NAME);
            CreateGeoserverStoreDto dto = (CreateGeoserverStoreDto) execution.getVariable("CreateGeoserverStoreDto");

            DxfDataStore dxfDataStore = new DxfDataStore(dto.getStoreName(), dto.getPathToFile());

            var response = new VectorStorage(token).create(dto.getWorkspaceName(), dxfDataStore);
            if (response.isSuccessful()) {
                log.debug("Successfully created DXF store with params: [{}]", dto);

                execution.setVariable(IS_CREATED_VAR_NAME, true);
                execution.setVariable("CreateFeatureDto", new CreateFeatureDto(event.getFeatureName(),
                                                                           dto.getWorkspaceName(),
                                                                           dto.getStoreName()));
            } else {
                String body = (String) response.getBody();
                if (body.contains("already exists")) {
                    log.debug("Store: '{}' already exist", dto.getWorkspaceName());

                    execution.setVariable(IS_CREATED_VAR_NAME, true);
                    execution.setVariable("CreateFeatureDto", new CreateFeatureDto(event.getFeatureName(),
                                                                               dto.getWorkspaceName(),
                                                                               dto.getStoreName()));
                } else {
                    String failMsg = baseFailMsg();
                    log.error("{}. With params: [{}]. Response code: {}", failMsg, dto, response.getCode());

                    execution.setVariable(IS_CREATED_VAR_NAME, false);
                    execution.setVariable(FAIL_REASON, failMsg);
                }
            }
        } catch (Exception e) {
            log.error("Failed to execute step: 'geoserverLayerDeleteDelegate'. Cause: {}", e.getCause().getMessage());

            execution.setVariable(IS_CREATED_VAR_NAME, false);
            execution.setVariable(FAIL_REASON, baseFailMsg());
        }
    }

    @NotNull
    private String baseFailMsg() {
        return "Не удалось создать DXF хранилище на геосервере";
    }
}
