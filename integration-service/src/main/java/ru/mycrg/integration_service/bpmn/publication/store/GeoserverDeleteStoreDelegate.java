package ru.mycrg.integration_service.bpmn.publication.store;

import okhttp3.Request;
import okhttp3.Response;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.queue.request.FilePublicationEvent;
import ru.mycrg.integration_service.bpmn.BaseHttpService;

import java.net.URL;

import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.EVENT_VAR_NAME;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.FAIL_REASON;

@Service("geoserverDeleteStoreDelegate")
public class GeoserverDeleteStoreDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(GeoserverDeleteStoreDelegate.class);

    private final BaseHttpService baseHttpService;

    public GeoserverDeleteStoreDelegate(BaseHttpService baseHttpService) {
        this.baseHttpService = baseHttpService;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        log.debug("Нельзя удалять хранилище 'без оглядки', поскольку на его основе могут быть созданы другие слоя");

//        log.debug("Выполняем удаление хранилища с геосервера");
//
//        try {
//            FilePublicationEvent event = (FilePublicationEvent) execution.getVariable(EVENT_VAR_NAME);
//            String workspaceName = event.getGeoserverPublicationData().getWorkspaceName();
//            String storeName = event.getGeoserverPublicationData().getStoreName();
//
//            Request request = new Request.Builder()
//                    .addHeader("Authorization", "Bearer " + event.getBaseWsProcess().getToken())
//                    .url(new URL(baseHttpService.getGisServiceUrl(),
//                                 "/geoserver/datastores/" + storeName))
//                    .delete()
//                    .build();
//
//            Response response = httpClient.newCall(request).execute();
//            if (response.isSuccessful()) {
//                log.debug("В рабочем пространстве: '{}' успешно удалено хранилище: [{}]", workspaceName, storeName);
//            } else {
//                String failMsg = baseFailMsg();
//                log.error("{}. Response code: {}", failMsg, response.code());
//
//                execution.setVariable(FAIL_REASON, failMsg);
//            }
//
//            response.close();
//        } catch (Exception e) {
//            log.error("На геосервере не удалось выполнить удаление хранилища. По причине: {}", e.getMessage(), e);
//
//            execution.setVariable(FAIL_REASON, baseFailMsg());
//        }
    }

//    @NotNull
//    private String baseFailMsg() {
//        return "Не удалось удалить хранилище с геосервера";
//    }
}
