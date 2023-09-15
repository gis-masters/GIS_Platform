package ru.mycrg.integration_service.bpmn.publication.shp.gis_layer;

import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.integration_service.bpmn.BaseHttpService;
import ru.mycrg.integration_service.bpmn.publication.dxf.gis_layer.DxfLayer;
import ru.mycrg.integration_service.bpmn.publication.dxf.store.CreateGeoserverStoreDto;

import java.net.URL;

import static java.lang.String.format;
import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;
import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("gisCreateShpLayerDelegate")
public class GisCreateShpLayerDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(GisCreateShpLayerDelegate.class);

    private final BaseHttpService baseHttpService;

    public GisCreateShpLayerDelegate(BaseHttpService baseHttpService) {
        this.baseHttpService = baseHttpService;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        log.debug("execute gisCreateShpLayerDelegate");

        try {
            String token = (String) execution.getVariable(TOKEN_VAR_NAME);
            DxfLayer dto = (DxfLayer) execution.getVariable("DxfLayer");
            CreateGeoserverStoreDto storeDto =
                    (CreateGeoserverStoreDto) execution.getVariable("CreateGeoserverStoreDto");
            dto.setDataStoreName(storeDto.getStoreName());

            Request request = new Request.Builder()
                    .addHeader("Authorization", "Bearer " + token)
                    .url(new URL(baseHttpService.getGisServiceUrl(), format("/projects/%d/layers", dto.getProjectId())))
                    .post(RequestBody.create(JSON_MEDIA_TYPE, objectMapper.writeValueAsString(dto)))
                    .build();

            Response response = httpClient.newCall(request).execute();
            if (response.isSuccessful()) {
                log.debug("Successfully created SHP layer with params: [{}]", dto);

                execution.setVariable(IS_CREATED_VAR_NAME, true);
            } else {
                String failMsg = baseFailMsg();
                log.error("{}. With params: [{}]. Response code: {}", failMsg, dto, response.code());

                execution.setVariable(IS_CREATED_VAR_NAME, false);
                execution.setVariable(FAIL_REASON, failMsg);
            }
        } catch (Exception e) {
            log.error(format("Failed to execute step: 'gisCreateShpLayerDelegate'. Cause: %s", e.getMessage()), e);

            execution.setVariable(IS_CREATED_VAR_NAME, false);
            execution.setVariable(FAIL_REASON, baseFailMsg());
        }
    }

    @NotNull
    private String baseFailMsg() {
        return "Не удалось создать слой на gis сервисе";
    }
}
