package ru.mycrg.geoserver_client.services.storage;

import okhttp3.Request;
import okhttp3.RequestBody;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;

public class StorageService extends GeoServerBaseService {

    public void createStorage(final String databaseName, final String schemaName,
                              final String workspaceName, final String dataStoreName) throws Exception {
        log.debug("create storage: {}", dataStoreName);

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

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getRootAccessToken())
                .url(getGeoserverRestUrl() + "/workspaces/" + workspaceName + "/datastores")
                .post(body)
                .build();

        doRequest(request, "createDataStore");
    }

}
