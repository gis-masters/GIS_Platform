package ru.mycrg.geoserver_client.services.coverages;

import okhttp3.Request;
import okhttp3.RequestBody;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;

/**
 * A coverage is a raster data set which originates from a coverage store.
 */
public class Coverages extends GeoServerBaseService {

    public static final String WORKSPACES = "/workspaces/";
    public static final String COVERAGE_STORES = "/coveragestores/";

    public Coverages(String accessToken) {
        super(accessToken);
    }

    public ResponseModel<Object> create(String workspaceName, String coverageStore, Coverage coverage)
            throws HttpClientException {
        String payload = gson.toJson(new CoverageModel(coverage));

        String url = getGeoserverRestUrl().append(WORKSPACES).append(workspaceName)
                                          .append(COVERAGE_STORES).append(coverageStore)
                                          .append("/coverages")
                                          .toString();

        Request request = builderWithBearerAuth
                .url(url)
                .post(RequestBody.create(JSON_MEDIA_TYPE, payload))
                .build();

        return httpClient.handleRequest(request);
    }
}
