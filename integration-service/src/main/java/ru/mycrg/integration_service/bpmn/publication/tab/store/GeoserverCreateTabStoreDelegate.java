package ru.mycrg.integration_service.bpmn.publication.tab.store;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.PlaceTabFileEvent;
import ru.mycrg.geoserver_client.contracts.datastores.MapInfoDataStore;
import ru.mycrg.geoserver_client.services.storage.vector.VectorStorage;
import ru.mycrg.integration_service.bpmn.publication.dxf.feature.CreateFeatureDto;
import ru.mycrg.integration_service.bpmn.publication.dxf.store.CreateGeoserverStoreDto;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("geoserverCreateTabStoreDelegate")
public class GeoserverCreateTabStoreDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(GeoserverCreateTabStoreDelegate.class);

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        log.debug("execute geoserverCreateTabStoreDelegate");

        try {
            String token = (String) execution.getVariable(TOKEN_VAR_NAME);
            PlaceTabFileEvent event = (PlaceTabFileEvent) execution.getVariable(EVENT_VAR_NAME);
            CreateGeoserverStoreDto dto = (CreateGeoserverStoreDto) execution.getVariable("CreateGeoserverStoreDto");

            MapInfoDataStore mapInfoDataStore = new MapInfoDataStore(dto.getStoreName(), dto.getPathToFile());

            var response = new VectorStorage(token).create(dto.getWorkspaceName(), mapInfoDataStore);
            if (response.isSuccessful()) {
                log.debug("Successfully created TAB store with params: [{}]", dto);

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
        return "Не удалось создать TAB хранилище на геосервере";
    }
}
