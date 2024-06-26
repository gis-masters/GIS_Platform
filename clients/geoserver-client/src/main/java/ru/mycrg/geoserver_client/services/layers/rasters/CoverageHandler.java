package ru.mycrg.geoserver_client.services.layers.rasters;

import okhttp3.Request;
import okhttp3.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;
import static ru.mycrg.http_client.JsonConverter.toJson;

public class CoverageHandler extends GeoServerBaseService {

    private final Logger log = LoggerFactory.getLogger(CoverageHandler.class);

    public static final String WORKSPACES = "/workspaces/";
    public static final String COVERAGE_STORES = "/coveragestores/";
    public static final String COVERAGES = "/coverages/";

    public CoverageHandler(String accessToken) {
        super(accessToken);
    }

    public boolean isExist(String workspace, String store, String layer) {
        String url = getGeoserverRestUrl().append(WORKSPACES).append(workspace)
                                          .append(COVERAGE_STORES).append(store)
                                          .append(COVERAGES).append(layer)
                                          .toString();

        Request request = builderWithBearerAuth.url(url)
                                               .get().build();

        try {
            return httpClient.handleRequest(request).isSuccessful();
        } catch (Exception e) {
            return false;
        }
    }

    public ResponseModel<Object> create(String workspace, String store, CoverageModel coverage)
            throws HttpClientException {
        String payload = toJson(new CoverageWrapper(coverage));

        log.debug("In store: '{}' try create raster layer: '{}'", store, payload);

        String url = getGeoserverRestUrl().append(WORKSPACES).append(workspace)
                                          .append(COVERAGE_STORES).append(store)
                                          .append(COVERAGES)
                                          .toString();

        Request request = builderWithBearerAuth.url(url)
                                               .post(RequestBody.create(JSON_MEDIA_TYPE, payload))
                                               .build();

        return httpClient.handleRequest(request);
    }

    //TODO: Придётся переписать, если будет необходимость обновлять другие поля
    public ResponseModel<Object> updateTransparentColorParameter(String workspace, String store, String coverageName,
                                                                 String colorCode)
            throws HttpClientException {
        log.debug("try set default color for raster layer: '{}' in store: '{}'", coverageName, store);

        String payload = String.format("{ \"coverage\": {" +
                                               "        \"parameters\": {" +
                                               "            \"entry\": [" +
                                               "                {" +
                                               "                    \"string\": [" +
                                               "                        \"InputTransparentColor\"," +
                                               "                        \"%s\"" +
                                               "                    ]" +
                                               "                }" +
                                               "            ]" +
                                               "        }" +
                                               "    }}", colorCode);

        String url = getGeoserverRestUrl().append(WORKSPACES).append(workspace)
                                          .append(COVERAGE_STORES).append(store)
                                          .append(COVERAGES).append(coverageName)
                                          .toString();

        Request request = builderWithBearerAuth.url(url)
                                               .put(RequestBody.create(JSON_MEDIA_TYPE, payload))
                                               .build();

        return httpClient.handleRequest(request);
    }
}
