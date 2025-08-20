package ru.mycrg.geoserver_client.services.workspace;

import okhttp3.Request;
import okhttp3.RequestBody;
import org.jetbrains.annotations.NotNull;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.exceptions.HttpClientException;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;

public class WorkspacesService extends GeoServerBaseService {

    public WorkspacesService(String accessToken) {
        super(accessToken);
    }

    public void createWorkspace(String name) throws HttpClientException {
        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, "{\"workspace\": {\"name\": \"" + name + "\"}}");

        Request request = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/workspaces")
                .post(body)
                .build();

        httpClient.handleRequestAsString(request);
    }

    /**
     * delete workspace with their contents
     *
     * @param name name
     */
    public void deleteWorkspace(@NotNull String name) throws HttpClientException {
        Request request = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/workspaces/" + name + "?recurse=true")
                .delete()
                .build();

        httpClient.handleRequest(request);
    }
}
