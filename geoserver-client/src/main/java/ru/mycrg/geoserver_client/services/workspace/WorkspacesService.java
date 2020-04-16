package ru.mycrg.geoserver_client.services.workspace;

import okhttp3.Request;
import okhttp3.RequestBody;
import org.jetbrains.annotations.NotNull;
import ru.mycrg.geoserver_client.GeoserverClientResponse;
import ru.mycrg.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;

public class WorkspacesService extends GeoServerBaseService {

    public GeoserverClientResponse createWorkspace(String name) throws GeoserverClientException {
        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, "{\"workspace\": {\"name\": \"" + name + "\"}}");

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getRootAccessToken())
                .url(getGeoserverRestUrl() + "/workspaces")
                .post(body)
                .build();

        return doRequest(request);
    }

    public GeoserverClientResponse deleteWorkspace(@NotNull String name) throws GeoserverClientException {
        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getRootAccessToken())
                .url(getGeoserverRestUrl() + "/workspaces/" + name + "?recurse=true")
                .delete()
                .build();

        return doRequest(request);
    }

}
