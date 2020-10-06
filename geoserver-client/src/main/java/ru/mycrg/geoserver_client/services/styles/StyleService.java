package ru.mycrg.geoserver_client.services.styles;

import okhttp3.Request;
import okhttp3.RequestBody;
import ru.mycrg.geoserver_client.GeoserverClientResponse;
import ru.mycrg.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;

public class StyleService extends GeoServerBaseService {

    public StyleService(String accessToken) {
        super(accessToken);
    }

    /**
     * Привязать стиль к слою. (Устанавливает слой по-умолчанию)
     *
     * @param complexLayerName Название слоя
     * @param styleName        Название стиля
     */
    public GeoserverClientResponse associate(String complexLayerName, String styleName) {

        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE,
                "{\n" +
                "    \"style\": {\n" +
                "        \"name\": \"" + styleName + "\",\n" +
                "        \"filename\": \"" + styleName + ".sld\"\n" +
                "    }\n" +
                "}");

        String url = getGeoserverRestUrl()
                .append("/layers/").append(complexLayerName)
                .append("/styles")
                .append("?default=true").toString();

        Request request = builderWithBearerAuth
                .url(url)
                .post(body)
                .build();

        return doRequest(request);
    }

}
