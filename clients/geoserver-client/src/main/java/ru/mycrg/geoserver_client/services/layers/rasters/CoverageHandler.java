package ru.mycrg.geoserver_client.services.layers.rasters;

import com.google.gson.JsonSyntaxException;
import okhttp3.Request;
import okhttp3.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;

public class CoverageHandler extends GeoServerBaseService {

    private final Logger log = LoggerFactory.getLogger(CoverageHandler.class);

    public static final String WORKSPACES = "/workspaces/";
    public static final String COVERAGE_STORES = "/coveragestores/";
    public static final String COVERAGES = "/coverages/";

    public CoverageHandler(String accessToken) {
        super(accessToken);
    }

    public boolean isExist(String workspace, String store, String layer) throws HttpClientException {
        String url = getGeoserverRestUrl().append(WORKSPACES).append(workspace)
                                          .append(COVERAGE_STORES).append(store)
                                          .append(COVERAGES).append(layer)
                                          .toString();

        Request request = builderWithBearerAuth.url(url)
                                               .get().build();

        try {
            return httpClient.handleRequest(request).isSuccessful();
        } catch (JsonSyntaxException e) {
            return false;
        }
    }

    public ResponseModel<Object> create(String workspace, String store, CoverageModel coverage)
            throws HttpClientException {
        log.debug("try create raster layer: '{}' in store: '{}'", coverage.getName(), store);

        String payload = gson.toJson(new CoverageWrapper(coverage));

        String url = getGeoserverRestUrl().append(WORKSPACES).append(workspace)
                                          .append(COVERAGE_STORES).append(store)
                                          .append(COVERAGES)
                                          .toString();

        Request request = builderWithBearerAuth.url(url)
                                               .post(RequestBody.create(JSON_MEDIA_TYPE, payload))
                                               .build();

        return httpClient.handleRequest(request);
    }
}
