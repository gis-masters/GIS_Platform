package ru.mycrg.geoserver_client.services.wfs;

import okhttp3.HttpUrl;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.io.IOException;

public class WfsService extends GeoServerBaseService {

    private static final Logger log = LoggerFactory.getLogger(WfsService.class);

    private static final String WFS = "WFS";
    private static final String VERSION = "1.0.0";
    private static final String OUTPUT_FORMAT = "shape-zip";
    private static final String EXCEPTIONS_FORMAT = "application/json";
    private static final String REQUEST_TYPE = "GetFeature";
    private static final String DEFAULT_EPSG = "EPSG:3857";
    private static final String DEFAULT_CHARSET = "CHARSET:UTF-8";

    public WfsService(String accessToken) {
        super(accessToken);
    }

    public byte[] downloadShapeFile(ComplexName complexName) {
        return downloadShapeFile(complexName, DEFAULT_EPSG, DEFAULT_CHARSET);
    }

    public byte[] downloadShapeFile(ComplexName complexName, String srsName) {
        return downloadShapeFile(complexName, srsName, DEFAULT_CHARSET);
    }

    public byte[] downloadShapeFile(ComplexName complexName, String srsName, String charset)
            throws GeoserverClientException {
        if (httpClient == null || geoserverInfo == null) {
            throw new GeoserverClientException("GeoServer не инициализирован");
        }

        if (srsName == null || srsName.trim().isEmpty()) {
            throw new GeoserverClientException("srsName параметр не может быть пустым");
        }

        if (!srsName.matches("^EPSG:\\d+$")) {
            throw new GeoserverClientException("Некорректный формат srsName. Ожидается: EPSG:*, сейчас: " + srsName);
        }

        HttpUrl url = getGeoserverWfsUrl()
                .newBuilder()
                .addQueryParameter("service", WFS)
                .addQueryParameter("version", VERSION)
                .addQueryParameter("request", REQUEST_TYPE)
                .addQueryParameter("typeName", complexName.getComplexName())
                .addQueryParameter("exceptions", EXCEPTIONS_FORMAT)
                .addQueryParameter("outputFormat", OUTPUT_FORMAT)
                .addQueryParameter("srsName", srsName)
                .addQueryParameter("format_options", "CHARSET:" + charset)
                .build();

        Request httpRequest = builderWithBearerAuth.url(url)
                                                   .get()
                                                   .build();

        log.debug("Запрос на Geoserver: [{}]", httpRequest);

        // ожидаем получить zip архив с shp файлом
        try (Response response = httpClient.getRequestHandler().handle(httpRequest)) {
            if (!response.isSuccessful()) {
                throw new GeoserverClientException(
                        "Не удалось получить данные с GeoServer. Status: " + response.code());
            }

            ResponseBody body = response.body();
            if (body == null) {
                throw new GeoserverClientException("Получен пустой ответ от GeoServer");
            }

            return body.bytes();
        } catch (HttpClientException e) {
            throw new GeoserverClientException("Не удалось получить данные с GeoServer", e);
        } catch (IOException e) {
            throw new GeoserverClientException("Получен пустой ответ от GeoServer", e);
        }
    }
}
