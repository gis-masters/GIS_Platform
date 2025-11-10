package ru.mycrg.geoserver_client.services.styles;

import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.geoserver_client.services.styles.models.GeoserverStyleResponse;
import ru.mycrg.geoserver_client.services.styles.models.Style;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.util.Optional;

import static java.lang.String.format;
import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;

public class StyleService extends GeoServerBaseService {

    private final String SLD_1_1_CONTENT_TYPE = "application/vnd.ogc.se+xml";

    private final Logger log = LoggerFactory.getLogger(StyleService.class);

    public StyleService(String accessToken) {
        super(accessToken);
    }

    public Optional<Style> getByName(String styleName) throws HttpClientException {
        log.info("Получение системной информации о стиле: {} ", styleName);
        String url = getGeoserverRestUrl().append("/styles/")
                                          .append(format("%s.json", styleName))
                                          .toString();

        Request request = builderWithBearerAuth.url(url)
                                               .get().build();

        GeoserverStyleResponse body = httpClient.handleRequest(request, GeoserverStyleResponse.class)
                                                .getBody();
        if (body != null) {
            Style style = httpClient.handleRequest(request, GeoserverStyleResponse.class)
                                    .getBody()
                                    .getStyle();

            return Optional.of(style);
        } else {
            return Optional.empty();
        }
    }

    public ResponseModel<String> getStyleBodyFromDefault(String styleName) throws HttpClientException {
        String url = getGeoserverRestUrl().append("/styles/")
                                          .append(styleName)
                                          .toString();

        Request request = builderWithBearerAuth.url(url)
                                               .get()
                                               .addHeader("Accept", SLD_1_1_CONTENT_TYPE)
                                               .build();

        return httpClient.handleRequestAsString(request);
    }

    public ResponseModel<String> getStyleBodyFromWorkspace(String styleName, String workSpace)
            throws HttpClientException {
        String url = getGeoserverRestUrl().append("/workspaces/")
                                          .append(workSpace)
                                          .append("/styles/")
                                          .append(styleName)
                                          .toString();

        Request request = builderWithBearerAuth.url(url)
                                               .get()
                                               .addHeader("Accept", SLD_1_1_CONTENT_TYPE)
                                               .build();

        return httpClient.handleRequestAsString(request);
    }

    /**
     * Привязать стиль к слою. (Устанавливает слой по-умолчанию)
     *
     * @param complexLayerName Название слоя
     * @param styleName        Название стиля
     */
    public ResponseModel<Object> associate(String complexLayerName, String styleName) throws HttpClientException {
        RequestBody body = RequestBody.create(
                JSON_MEDIA_TYPE,
                "{" +
                        "    \"style\": {" +
                        "        \"name\": \"" + styleName + "\"," +
                        "        \"filename\": \"" + styleName + ".sld\"" +
                        "    }" +
                        "}");

        String url = getGeoserverRestUrl()
                .append("/layers/").append(complexLayerName)
                .append("/styles")
                .append("?default=true").toString();

        Request request = builderWithBearerAuth.url(url)
                                               .post(body).build();

        ResponseModel<String> stringResponse = httpClient.handleRequestAsString(request);

        return new ResponseModel<>(stringResponse, null);
    }

    public void postStyle(String newStyleName, String actualBody, String workspace) throws HttpClientException {
        log.debug("Creating style: {} with SLD content {} in workspace: {}", newStyleName, actualBody, workspace);

        RequestBody body = RequestBody.create(
                MediaType.parse(SLD_1_1_CONTENT_TYPE), actualBody);

        String url = getGeoserverRestUrl() + "/workspaces/" + workspace + "/styles?name=" + newStyleName;
        log.debug("POST URL: {}", url);

        Request request = builderWithBearerAuth
                .url(url)
                .addHeader("Accept", "application/json")
                .addHeader("Content-Type", SLD_1_1_CONTENT_TYPE)
                .post(body)
                .build();

        ResponseModel<String> response = httpClient.handleRequestAsString(request);

        if (!response.isSuccessful()) {
            log.error("Невозможно создать стиль {}: {}", newStyleName, response.getCode());

            throw new HttpClientException("Стиль на геосервере создать не получилось: " + response.getCode());
        }

        log.debug("Стиль {} создан успешно в workspace {}", newStyleName, workspace);
    }
}
