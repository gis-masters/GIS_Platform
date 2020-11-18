package ru.mycrg.geoserver_client.services.storage.raster;

import okhttp3.Request;
import okhttp3.RequestBody;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;

public class RasterStorage extends GeoServerBaseService {

    public static final String WORKSPACES = "/workspaces/";
    public static final String DATASTORES = "/coveragestores/";

    public RasterStorage(String accessToken) {
        super(accessToken);
    }

    /**
     * Adds a new GeoTIFF coverage store.
     *
     * @param workspace The name of the workspace.
     * @param fileName  The file name.
     * @param url       Path to file.
     */
    public ResponseModel<Object> createGeoTIFF(String workspace, String fileName, String url) throws HttpClientException {
        final CoverageStore coverageStore = new CoverageStore(fileName, workspace, true, "GeoTIFF", url);

        String payload = gson.toJson(new CoverageStoreModel(coverageStore));

        Request request = builderWithBearerAuth
                .url(getGeoserverRestUrl() + WORKSPACES + workspace + DATASTORES)
                .post(RequestBody.create(JSON_MEDIA_TYPE, payload))
                .build();

        return httpClient.handleRequest(request);
    }
}
