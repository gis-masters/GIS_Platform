package ru.mycrg.wrapper.geoserver_client.services.styles;

import okhttp3.Request;
import okhttp3.RequestBody;
import org.springframework.stereotype.Service;
import ru.mycrg.wrapper.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.wrapper.geoserver_client.services.GeoServerBaseService;

import static ru.mycrg.wrapper.geoserver_client.GeoServerConstants.JSON_MEDIA_TYPE;

@Service
public class StyleService extends GeoServerBaseService {

    /**
     * Привязать стиль к слою. (Устанавливает слой по-умолчанию)
     *
     * @param layerName Название слоя
     * @param styleName Название стиля
     * @param jwtToken Рут токен
     * @throws GeoserverClientException
     */
    public void associate(String layerName, String styleName, String jwtToken)
            throws GeoserverClientException {

        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE,
                "{\n" +
                "    \"style\": {\n" +
                        "        \"name\": \"" + styleName + "\",\n" +
                        "        \"filename\": \"" + styleName + ".sld\"\n" +
                "    }\n" +
                "}");

        String url = getRootRestUrl()
                .append("/layers/").append(styleName)
                .append("/styles")
                .append("?default=true").toString();

        log.debug("associate style {} to layer {}", styleName, layerName);

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + jwtToken)
                .url(url)
                .post(body)
                .build();

        doRequest(request, "create FeatureType");
    }

}
