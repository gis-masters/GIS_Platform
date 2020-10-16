package ru.mycrg.geoserver_client.services.resources;

import okhttp3.Request;
import ru.mycrg.geoserver_client.GeoserverClientResponse;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;

public class Version extends GeoServerBaseService {

    public Version(String accessToken) {
        super(accessToken);
    }

    public GeoserverClientResponse getMigrationVersion() {
        Request request = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/resource/migrationVersion")
                .get()
                .build();

        return doRequest(request);
    }
}
