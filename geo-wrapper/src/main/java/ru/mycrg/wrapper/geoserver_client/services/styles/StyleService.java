package ru.mycrg.wrapper.geoserver_client.services.styles;

import okhttp3.Request;
import okhttp3.RequestBody;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.wrapper.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.wrapper.geoserver_client.services.AuthService;
import ru.mycrg.wrapper.geoserver_client.services.GeoServerBaseService;

import java.io.IOException;

import static ru.mycrg.wrapper.geoserver_client.GeoServerConstants.JSON_MEDIA_TYPE;

@Service
public class StyleService extends GeoServerBaseService {

    @Autowired
    private AuthService authService;

    /**
     * Привязать стиль к слою. (Устанавливает слой по-умолчанию)
     *
     * @param layerName Название слоя
     * @param styleName Название стиля
     * @throws GeoserverClientException
     */
    public void associate(String layerName, String styleName)
            throws GeoserverClientException {

        try {
            authService.authorize();

            RequestBody body = RequestBody.create(JSON_MEDIA_TYPE,
                    "{\n" +
                    "    \"style\": {\n" +
                    "        \"name\": \"" + styleName + "\",\n" +
                    "        \"filename\": \"" + styleName + ".sld\"\n" +
                    "    }\n" +
                    "}");

            String url = getRootRestUrl()
                    .append("/layers/").append(layerName)
                    .append("/styles")
                    .append("?default=true").toString();

            log.debug("associate style url: {}", url);

            Request request = new Request.Builder()
                    .addHeader("Authorization", "Bearer " + getAccessToken())
                    .url(url)
                    .post(body)
                    .build();

            doRequest(request, "associate style");
        } catch (IOException e) {
            log.error("Could not authorize");
        }
    }

}
