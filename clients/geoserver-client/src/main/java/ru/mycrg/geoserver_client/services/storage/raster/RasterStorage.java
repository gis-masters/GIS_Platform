package ru.mycrg.geoserver_client.services.storage.raster;

import okhttp3.Request;
import okhttp3.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.geoserver_client.contracts.coveragestores.CoverageStoreRequestModel;
import ru.mycrg.geoserver_client.contracts.coveragestores.CoverageStoreResponseWrapper;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;
import static ru.mycrg.http_client.JsonConverter.toJson;

public class RasterStorage extends GeoServerBaseService {

    private final Logger log = LoggerFactory.getLogger(RasterStorage.class);

    public static final String WORKSPACES = "/workspaces/";
    public static final String COVERAGE_STORES = "/coveragestores/";

    public RasterStorage(String accessToken) {
        super(accessToken);
    }

    /**
     * Adds a new GeoTIFF coverage store.
     *
     * @param workspace The name of the workspace.
     * @param store     The name of store.
     * @param path      Path to file.
     */
    public ResponseModel<Object> createGeoTIFF(String workspace, String store, String path)
            throws HttpClientException {
        log.debug("Try create GeoTIFF store with name: '{}' in workspace: '{}', by resource path: '{}'",
                  store, workspace, path);

        CoverageStoreRequestModel coverageStore =
                new CoverageStoreRequestModel(store, workspace, true, "GeoTIFF", path);

        String payload = toJson(new CoverageStoreRequestWrapper(coverageStore));

        Request request = builderWithBearerAuth
                .url(getGeoserverRestUrl() + WORKSPACES + workspace + COVERAGE_STORES)
                .post(RequestBody.create(JSON_MEDIA_TYPE, payload))
                .build();

        return httpClient.handleRequest(request);
    }

    public ResponseModel<CoverageStoreResponseWrapper> getStorage(String workspace, String store)
            throws HttpClientException {
        String url = getGeoserverRestUrl().append(WORKSPACES).append(workspace)
                                          .append(COVERAGE_STORES).append(store)
                                          .toString();

        Request request = builderWithBearerAuth.url(url)
                                               .get().build();

        return httpClient.handleRequest(request, CoverageStoreResponseWrapper.class);
    }

    public boolean isExist(String workspace, String store) {
        String url = getGeoserverRestUrl().append(WORKSPACES).append(workspace)
                                          .append(COVERAGE_STORES).append(store)
                                          .toString();

        Request request = builderWithBearerAuth.url(url)
                                               .get().build();

        try {
            return httpClient.handleRequest(request).isSuccessful();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Delete  coverages from geoserver
     *
     * @param workspaceName The name of the workspace.
     * @param coverageStore The name of store.
     * @param recurse       responsible for cascade deleting of coverages
     */
    public ResponseModel<Object> delete(String workspaceName, String coverageStore, Boolean recurse)
            throws HttpClientException {
        log.debug("try delete coverageStore: '{}' in workspace: '{}'", coverageStore, workspaceName);

        String coverageUrl = getGeoserverRestUrl().append(WORKSPACES).append(workspaceName)
                                                  .append(COVERAGE_STORES).append(coverageStore)
                                                  .append("?recurse=").append(recurse)
                                                  .toString();

        Request request = builderWithBearerAuth.url(coverageUrl)
                                               .delete().build();

        return httpClient.handleRequest(request, Object.class);
    }
}
