package ru.mycrg.integration_service.bpmn.publication.shp.store;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.PlaceShapeFileEvent;
import ru.mycrg.geoserver_client.contracts.datastores.ShpDataStore;
import ru.mycrg.geoserver_client.services.storage.vector.VectorStorage;
import ru.mycrg.integration_service.bpmn.publication.dxf.feature.CreateFeatureDto;
import ru.mycrg.integration_service.bpmn.publication.dxf.store.CreateGeoserverStoreDto;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("geoserverCreateShpStoreDelegate")
public class GeoserverCreateShpStoreDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(GeoserverCreateShpStoreDelegate.class);

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        log.debug("execute GeoserverCreateShpStoreDelegate");

        try {
            String token = (String) execution.getVariable(TOKEN_VAR_NAME);
            PlaceShapeFileEvent event = (PlaceShapeFileEvent) execution.getVariable(EVENT_VAR_NAME);
            CreateGeoserverStoreDto dto = (CreateGeoserverStoreDto) execution.getVariable("CreateGeoserverStoreDto");

            ShpDataStore shpDataStore = new ShpDataStore(dto.getStoreName(), dto.getPathToFile());

            var response = new VectorStorage(token).create(dto.getWorkspaceName(), shpDataStore);
            if (response.isSuccessful()) {
                log.debug("Successfully created SHP store with params: [{}]", dto);

                execution.setVariable(IS_CREATED_VAR_NAME, true);
                execution.setVariable("CreateFeatureDto",
                                      new CreateFeatureDto(event.getFeatureName(),
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
            log.error("Failed to execute step: 'geoserverCreateShpStoreDelegate'. Cause: {}", e.getMessage(), e);

            execution.setVariable(IS_CREATED_VAR_NAME, false);
            execution.setVariable(FAIL_REASON, baseFailMsg());
        }
    }

    @NotNull
    private String baseFailMsg() {
        return "Не удалось создать SHP хранилище на геосервере";
    }
}
