package ru.mycrg.geoserver_client.services.styles;

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

    private final Logger log = LoggerFactory.getLogger(StyleService.class);

    public StyleService(String accessToken) {
        super(accessToken);
    }

    public Optional<Style> getByName(String styleName) throws HttpClientException {
        log.info("get style: {} ", styleName);
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

        return httpClient.handleRequest(request, Object.class);
    }
}
