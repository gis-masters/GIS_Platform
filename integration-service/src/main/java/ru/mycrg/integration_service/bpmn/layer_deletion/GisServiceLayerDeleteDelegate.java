package ru.mycrg.integration_service.bpmn.layer_deletion;

import okhttp3.Request;
import okhttp3.Response;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.integration_service.bpmn.BaseHttpService;

import java.net.URL;

import static java.util.Objects.requireNonNull;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("gisServiceLayerDeleteDelegate")
public class GisServiceLayerDeleteDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(GisServiceLayerDeleteDelegate.class);

    private final BaseHttpService baseHttpService;

    public GisServiceLayerDeleteDelegate(BaseHttpService baseHttpService) {
        this.baseHttpService = baseHttpService;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        final String fileId = execution.getVariable(ENTITY_ID_VAR_NAME).toString();
        final String accessToken = execution.getVariable(TOKEN_VAR_NAME).toString();

        final String findRelatedLayersPath = String.format("/projects/find-related-to-file-layers?fileId=%s", fileId);

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + accessToken)
                .url(new URL(baseHttpService.getGisServiceUrl(), findRelatedLayersPath))
                .get()
                .build();

        Response response = httpClient.newCall(request).execute();
        if (response.isSuccessful()) {
            String body = requireNonNull(response.body()).string();
            JSONArray relatedLayers = new JSONArray(body);

            for (int i = 0; i < relatedLayers.length(); i++) {
                JSONObject relatedObj = relatedLayers.getJSONObject(i);
                String tableName = requireNonNull(relatedObj.getJSONObject("layer")).get("complexName").toString();
                execution.setVariable(LAYER_COMPLEX_NAME, tableName);

                deleteRelatedLayers(relatedObj, accessToken);
            }
        } else {
            log.warn("Слои связанные с файлами не были удалены на gis-service");
        }

        response.close();
    }

    private void deleteRelatedLayers(JSONObject relatedObj, String accessToken) throws Exception {
        Object projId = requireNonNull(relatedObj.getJSONObject("project")).get("id");
        Object layerId = requireNonNull(relatedObj.getJSONObject("layer")).get("id");

        final String findRelatedLayersPath = String.format("/projects/%s/layers/%s", projId, layerId);

        Request req = new Request.Builder()
                .addHeader("Authorization", "Bearer " + accessToken)
                .url(new URL(baseHttpService.getGisServiceUrl(), findRelatedLayersPath))
                .delete()
                .build();

        Response response = httpClient.newCall(req).execute();

        if (response.isSuccessful()) {
            log.info("Слой c id: {} были удалены на gis-service", layerId);
        } else {
            log.warn("Слой c id: {} не были удалены на gis-service", layerId);
        }

        response.close();
    }
}

