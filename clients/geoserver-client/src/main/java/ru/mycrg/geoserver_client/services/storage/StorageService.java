package ru.mycrg.geoserver_client.services.storage;

import com.google.gson.JsonSyntaxException;
import okhttp3.Request;
import okhttp3.RequestBody;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.exceptions.HttpClientException;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;

public class StorageService extends GeoServerBaseService {

    public StorageService(String accessToken) {
        super(accessToken);
    }

    public void createStorage(final String databaseName,
                              final String schemaName,
                              final String workspaceName,
                              final String dataStoreName) throws HttpClientException {
        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, "{\n" +
                "\t\"dataStore\": {\n" +
                "\t\t\"name\": \"" + dataStoreName + "\",\n" +
                "\t\t\"connectionParameters\": {\n" +
                "\t\t\t\"host\": \"" + dbInfo.getDbHost() + "\",\n" +
                "\t\t\t\"port\": \"" + dbInfo.getDbPort() + "\",\n" +
                "\t\t\t\"database\": \"" + databaseName + "\",\n" +
                "\t\t\t\"schema\": \"" + schemaName + "\",\n" +
                "\t\t\t\"user\": \"" + dbInfo.getDbOwnerUser() + "\",\n" +
                "\t\t\t\"passwd\": \"" + dbInfo.getDbOwnerPassword() + "\",\n" +
                "\t\t\t\"dbtype\": \"postgis\"\n" +
                "\t\t}\n" +
                "\t}\n" +
                "}");

        Request request = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/workspaces/" + workspaceName + "/datastores")
                .post(body)
                .build();

        httpClient.handleRequest(request);
    }

    public DataStores getStores(final String workspaceName) throws HttpClientException {
        Request getStores = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/workspaces/" + workspaceName + "/datastores")
                .get()
                .build();

        try {
            return httpClient.handleRequest(getStores, DataStoreResponse.class)
                             .getBody()
                             .getDataStores();
        } catch (JsonSyntaxException e) {
            return new DataStores();
        }
    }

    public void deleteStorage(final String workspaceName,
                              final String dataStoreName) throws HttpClientException {
        final String url = getGeoserverRestUrl() + "/workspaces/" +
                workspaceName + "/datastores/" +
                dataStoreName + "?recurse=true";

        Request request = builderWithBearerAuth.url(url)
                                               .delete()
                                               .build();

        httpClient.handleRequest(request);
    }
}
