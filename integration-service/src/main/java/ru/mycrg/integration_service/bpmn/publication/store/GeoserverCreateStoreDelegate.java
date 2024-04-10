package ru.mycrg.integration_service.bpmn.publication.store;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.FilePublicationEvent;
import ru.mycrg.geoserver_client.contracts.datastores.DxfDataStore;
import ru.mycrg.geoserver_client.contracts.datastores.MapInfoDataStore;
import ru.mycrg.geoserver_client.contracts.datastores.ShpDataStore;
import ru.mycrg.geoserver_client.contracts.datastores.base.IParameterizedStore;
import ru.mycrg.geoserver_client.services.storage.vector.VectorStorage;
import ru.mycrg.http_client.ResponseModel;

import java.util.Map;

import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("geoserverCreateStoreDelegate")
public class GeoserverCreateStoreDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(GeoserverCreateStoreDelegate.class);

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        log.debug("Выполняем создание хранилища на геосервере");

        try {
            FilePublicationEvent event = (FilePublicationEvent) execution.getVariable(EVENT_VAR_NAME);
            String storeName = event.getGeoserverPublicationData().getStoreName();
            String pathToFile = event.getGisPublicationData().getPathToFile();

            IParameterizedStore<Map<String, Object>> store;
            switch (event.getType()) {
                case DXF:
                    store = new DxfDataStore(storeName, pathToFile);
                    break;
                case MID:
                case TAB:
                    store = new MapInfoDataStore(storeName, pathToFile);
                    break;
                case SHP:
                    store = new ShpDataStore(storeName, pathToFile);
                    break;
                default:
                    String msg = "Не поддерживаемый тип: " + event.getType();
                    log.error(msg);
                    execution.setVariable(FAIL_REASON, msg);
                    execution.setVariable(IS_CREATED_VAR_NAME, false);

                    return;
            }

            String workspaceName = event.getGeoserverPublicationData().getWorkspaceName();
            ResponseModel<Object> response = new VectorStorage(event.getBaseWsProcess().getToken())
                    .create(workspaceName, store);
            if (response.isSuccessful()) {
                log.debug("В рабочем пространстве: '{}' успешно создано хранилище: [{}]", workspaceName, store);

                execution.setVariable(IS_CREATED_VAR_NAME, true);
            } else {
                String body = (String) response.getBody();
                if (body.contains("already exists")) {
                    log.debug("В рабочем пространстве: '{}' уже существует хранилище: [{}]", workspaceName, storeName);

                    execution.setVariable(IS_CREATED_VAR_NAME, true);
                } else {
                    String msg = String.format("В рабочем пространстве: '%s' не удалось создать хранилище: '%s'",
                                               workspaceName, storeName);
                    log.error("{} с параметрами: [{}]. Status code: {}", msg, store, response.getCode());

                    execution.setVariable(FAIL_REASON, msg);
                    execution.setVariable(IS_CREATED_VAR_NAME, false);
                }
            }
        } catch (Exception e) {
            String msg = "На геосервере не удалось выполнить создание хранилища на основе файла.";
            log.error("{} По причине: {}", msg, e.getCause().getMessage());

            execution.setVariable(FAIL_REASON, msg);
            execution.setVariable(IS_CREATED_VAR_NAME, false);
        }
    }
}
