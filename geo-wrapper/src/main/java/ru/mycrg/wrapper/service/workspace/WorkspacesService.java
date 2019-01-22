package ru.mycrg.wrapper.service.workspace;

import okhttp3.Request;
import okhttp3.RequestBody;
import org.springframework.stereotype.Service;
import ru.mycrg.wrapper.service.GeoServerBaseService;
import ru.mycrg.wrapper.service.GeoServerConstants;

import java.io.IOException;

@Service
public class WorkspacesService extends GeoServerBaseService {

    public void createWorkspace(String name) throws IOException {
        RequestBody body = RequestBody.create(GeoServerConstants.JSON_MEDIA_TYPE, "{\"workspace\": {\"name\": \"" + name + "\"}}");

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getAccessToken())
                .url("http://" + geoserverHost() + "/geoserver/rest/workspaces")
                .post(body)
                .build();

        doRequest(request, "createWorkspace");
    }

}
