package ru.mycrg.geoserver_client.services.wfs;

import okhttp3.HttpUrl;
import okhttp3.Request;
import okhttp3.Response;
import okhttp3.ResponseBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    public WfsService(String accessToken) {
        super(accessToken);
    }

    public byte[] downloadShapeFile(ComplexName typeName, String srsName, String charset)
            throws HttpClientException, WfsExceptions, IOException {
        if (httpClient == null || geoserverInfo == null) {
            throw new WfsExceptions("GeoServer не инициализирован");
        }

        if (srsName == null || srsName.trim().isEmpty()) {
            throw new WfsExceptions("srsName параметр не может быть пустым");
        }

        if (!srsName.matches("^EPSG:\\d+$")) {
            throw new WfsExceptions("Некорректный формат srsName. Ожидается: EPSG:*, сейчас: " + srsName);
        }

        HttpUrl url = getGeoserverWfsUrl()
                .newBuilder()
                .addQueryParameter("service", WFS)
                .addQueryParameter("version", VERSION)
                .addQueryParameter("request", REQUEST_TYPE)
                .addQueryParameter("typeName", typeName.getComplexName())
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
                throw new HttpClientException("Не удалось получить данные с GeoServer. Status: " + response.code());
            }

            ResponseBody body = response.body();
            if (body == null) {
                throw new HttpClientException("Получен пустой ответ от GeoServer");
            }

            return body.bytes();
        }
    }
}
