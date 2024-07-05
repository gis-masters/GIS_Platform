package ru.mycrg.integration_service.bpmn.publication.gis_layer;

import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.publication.GeoserverPublicationData;
import ru.mycrg.data_service_contract.dto.publication.GisPublicationData;
import ru.mycrg.data_service_contract.enums.FilePublicationMode;
import ru.mycrg.data_service_contract.enums.FileType;
import ru.mycrg.data_service_contract.queue.request.FilePublicationEvent;
import ru.mycrg.integration_service.bpmn.BaseHttpService;

import java.net.URL;

import static java.lang.String.format;
import static ru.mycrg.data_service_contract.enums.FileType.TIF;
import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;
import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.BaseHttpService.httpClient;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("gisCreateLayerDelegate")
public class GisCreateLayerDelegate implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(GisCreateLayerDelegate.class);

    private final BaseHttpService baseHttpService;

    public GisCreateLayerDelegate(BaseHttpService baseHttpService) {
        this.baseHttpService = baseHttpService;
    }

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        log.debug("Выполняем создание слоя на gis-service в режиме full");

        try {
            FilePublicationEvent event = (FilePublicationEvent) execution.getVariable(EVENT_VAR_NAME);
            LayerPublicationDto dto = prepareLayerDto(event);

            String content = objectMapper.writeValueAsString(dto);
            log.debug("content: {}", content);

            Request request = new Request.Builder()
                    .addHeader("Authorization", "Bearer " + event.getBaseWsProcess().getToken())
                    .url(new URL(baseHttpService.getGisServiceUrl(), format("/projects/%d/layers", dto.getProjectId())))
                    .post(RequestBody.create(JSON_MEDIA_TYPE, content))
                    .build();

            Response response = httpClient.newCall(request).execute();
            if (response.isSuccessful()) {
                log.debug("Слой успешно создан");

                execution.setVariable(IS_CREATED_VAR_NAME, true);
            } else {
                String failMsg = baseFailMsg();
                log.error("{}. С параметрами: [{}]. Status code: {}", failMsg, content, response.code());

                execution.setVariable(IS_CREATED_VAR_NAME, false);
                execution.setVariable(FAIL_REASON, failMsg);
            }

            response.close();
        } catch (Exception e) {
            String msg = "Не удалось выполнить создание слоя";
            log.error("{} По причине: {}", msg, e.getCause().getMessage());

            execution.setVariable(IS_CREATED_VAR_NAME, false);
            execution.setVariable(FAIL_REASON, baseFailMsg());
        }
    }

    @NotNull
    private LayerPublicationDto prepareLayerDto(FilePublicationEvent event) {
        GeoserverPublicationData geoserverPublicationData = event.getGeoserverPublicationData();
        GisPublicationData gisPublicationData = event.getGisPublicationData();

        FileType type = event.getType();
        if (type.equals(TIF)) {
            String dataSourceUri = "file://" + gisPublicationData.getPathToFile();

            return new LayerPublicationDto(geoserverPublicationData.getStoreName(),
                                           geoserverPublicationData.getFeatureTypeName(),
                                           gisPublicationData.getLayerTitle(),
                                           gisPublicationData.getLibraryId(),
                                           gisPublicationData.getRecordId(),
                                           gisPublicationData.getCrs(),
                                           gisPublicationData.getProjectId(),
                                           dataSourceUri,
                                           getMode(event));
        } else {
            return new LayerPublicationDto(type.name().toLowerCase(),
                                           getMode(event),
                                           gisPublicationData.getProjectId(),
                                           geoserverPublicationData.getFeatureTypeName(),
                                           geoserverPublicationData.getNativeName(),
                                           gisPublicationData.getLayerTitle(),
                                           gisPublicationData.getCrs(),
                                           gisPublicationData.getLibraryId(),
                                           gisPublicationData.getRecordId(),
                                           gisPublicationData.getStyleName(),
                                           geoserverPublicationData.getWorkspaceName(),
                                           geoserverPublicationData.getStoreName());
        }
    }

    @NotNull
    private String getMode(FilePublicationEvent event) {
        FilePublicationMode node = event.getPublicationMode();
        if (node.equals(FilePublicationMode.GIS)) {
            return "gis-service";
        } else if (node.equals(FilePublicationMode.GEOSERVER)) {
            return "geoserver";
        } else {
            return "full";
        }
    }

    @NotNull
    private String baseFailMsg() {
        return "Не удалось создать слой на gis сервисе";
    }
}
