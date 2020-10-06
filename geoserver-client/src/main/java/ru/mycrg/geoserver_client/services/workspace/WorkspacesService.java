package ru.mycrg.geoserver_client.services.workspace;

import okhttp3.Request;
import okhttp3.RequestBody;
import org.jetbrains.annotations.NotNull;
import ru.mycrg.geoserver_client.GeoserverClientResponse;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;

public class WorkspacesService extends GeoServerBaseService {

    public WorkspacesService(String accessToken) {
        super(accessToken);
    }

    public GeoserverClientResponse createWorkspace(String name) {
        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, "{\"workspace\": {\"name\": \"" + name + "\"}}");

        Request request = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/workspaces")
                .post(body)
                .build();

        return doRequest(request);
    }

    /**
     * delete workspace with their contents
     * @param name name
     * @return
     */
    public GeoserverClientResponse deleteWorkspace(@NotNull String name) {
        Request request = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/workspaces/" + name + "?recurse=true")
                .delete()
                .build();

        return doRequest(request);
    }

}
