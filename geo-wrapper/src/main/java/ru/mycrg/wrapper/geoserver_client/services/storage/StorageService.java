package ru.mycrg.wrapper.geoserver_client.services.storage;

import okhttp3.Request;
import okhttp3.RequestBody;
import org.springframework.stereotype.Service;
import ru.mycrg.wrapper.geoserver_client.services.GeoServerBaseService;

import static ru.mycrg.wrapper.geoserver_client.GeoServerConstants.JSON_MEDIA_TYPE;

@Service
public class StorageService extends GeoServerBaseService {

    public void createStorage(final String databaseName, final String schemaName,
                              final String workspaceName, final String dataStoreName) throws Exception {
        log.debug("create storage: {}", dataStoreName);

        String host = postgisHostWithPort().split(":")[0];
        String port = postgisHostWithPort().split(":")[1];

        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, "{\n" +
                "\t\"dataStore\": {\n" +
                "\t\t\"name\": \"" + dataStoreName + "\",\n" +
                "\t\t\"connectionParameters\": {\n" +
                "\t\t\t\"host\": \"" + host + "\",\n" +
                "\t\t\t\"port\": \"" + port + "\",\n" +
                "\t\t\t\"database\": \"" + databaseName + "\",\n" +
                "\t\t\t\"schema\": \"" + schemaName + "\",\n" +
                "\t\t\t\"user\": \"" + dbOwnerUser() + "\",\n" +
                "\t\t\t\"passwd\": \"" + dbOwnerPassword() + "\",\n" +
                "\t\t\t\"dbtype\": \"postgis\"\n" +
                "\t\t}\n" +
                "\t}\n" +
                "}");

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getAccessToken())
                .url("http://" + geoserverHost() + "/geoserver/rest/workspaces/" + workspaceName + "/datastores")
                .post(body)
                .build();

        doRequest(request, "createDataStore");
    }

}
