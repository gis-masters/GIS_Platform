package ru.mycrg.geoserver_client.services.coverages;

import okhttp3.Request;
import okhttp3.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;
import static ru.mycrg.http_client.JsonConverter.toJson;

/**
 * A coverage is a raster data set which originates from a coverage store.
 */
public class Coverages extends GeoServerBaseService {

    private final Logger log = LoggerFactory.getLogger(Coverages.class);

    public static final String WORKSPACES = "/workspaces/";
    public static final String COVERAGE_STORES = "/coveragestores/";
    public static final String COVERAGES = "/coverages/";

    public Coverages(String accessToken) {
        super(accessToken);
    }

    public ResponseModel<Object> create(String workspaceName, String coverageStore, Coverage coverage)
            throws HttpClientException {
        String payload = toJson(new CoverageModel(coverage));

        String url = getGeoserverRestUrl().append(WORKSPACES).append(workspaceName)
                                          .append(COVERAGE_STORES).append(coverageStore)
                                          .append(COVERAGES)
                                          .toString();

        Request request = builderWithBearerAuth
                .url(url)
                .post(RequestBody.create(JSON_MEDIA_TYPE, payload))
                .build();

        return httpClient.handleRequest(request);
    }

    public ResponseModel<Object> delete(String workspaceName,
                                        String coverageStore,
                                        String coverage) throws HttpClientException {
        log.debug("try delete coverage: '{}' in coverageStore: '{}' in workspace: '{}'",
                  coverage, coverageStore, workspaceName);

        String coverageUrl = getGeoserverRestUrl().append(WORKSPACES).append(workspaceName)
                                                  .append(COVERAGE_STORES).append(coverageStore)
                                                  .append(COVERAGES).append(coverage)
                                                  .toString();

        Request request = builderWithBearerAuth.url(coverageUrl)
                                               .delete().build();

        return httpClient.handleRequest(request, Object.class);
    }
}
