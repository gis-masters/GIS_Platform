package ru.mycrg.geoserver_client.services.storage.raster;

import okhttp3.Request;
import okhttp3.RequestBody;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;

public class RasterStorage extends GeoServerBaseService {

    public static final String WORKSPACES = "/workspaces/";
    public static final String DATA_STORES = "/coveragestores/";

    public RasterStorage(String accessToken) {
        super(accessToken);
    }

    /**
     * Adds a new GeoTIFF coverage store.
     *
     * @param workspace The name of the workspace.
     * @param name      The name of store.
     * @param url       Path to file.
     */
    public ResponseModel<Object> createGeoTIFF(String workspace, String name, String url) throws HttpClientException {
        final CoverageStoreRequestModel coverageStore = new CoverageStoreRequestModel(name, workspace, true, "GeoTIFF", url);

        String payload = gson.toJson(new CoverageStoreRequest(coverageStore));

        Request request = builderWithBearerAuth
                .url(getGeoserverRestUrl() + WORKSPACES + workspace + DATA_STORES)
                .post(RequestBody.create(JSON_MEDIA_TYPE, payload))
                .build();

        return httpClient.handleRequest(request);
    }

    public ResponseModel<CoverageStoreResponse> getStorage(String workspace, String store) throws HttpClientException {
        Request request = builderWithBearerAuth
                .url(getGeoserverRestUrl() + WORKSPACES + workspace + DATA_STORES + store)
                .get().build();

        return httpClient.handleRequest(request, CoverageStoreResponse.class);
    }
}
