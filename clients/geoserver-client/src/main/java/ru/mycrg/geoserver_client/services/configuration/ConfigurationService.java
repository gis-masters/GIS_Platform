package ru.mycrg.geoserver_client.services.configuration;

import okhttp3.RequestBody;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.exceptions.HttpClientException;

public class ConfigurationService extends GeoServerBaseService {

    public ConfigurationService(String accessToken) {
        super(accessToken);
    }

    /**
     * Reloads the GeoServer catalog and configuration from disk.
     * <p>
     * This operation is used in cases where an external tool has modified the on-disk configuration. This operation
     * will also force GeoServer to drop any internal caches and reconnect to all data stores. <a
     * href="https://docs.geoserver.org/stable/en/user/rest/api/reload.html">Reloading configuration</a>
     */
    public void reload() throws HttpClientException {
        httpClient.handleRequest(
                builderWithBearerAuth
                        .url(getGeoserverRestUrl() + "/reload")
                        .post(RequestBody.create(null, new byte[0]))
                        .build());
    }
}
