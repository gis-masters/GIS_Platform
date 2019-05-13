package ru.mycrg.wrapper.service.geoserver.storage;

import okhttp3.Request;
import okhttp3.RequestBody;
import org.springframework.stereotype.Service;
import ru.mycrg.wrapper.service.geoserver.GeoServerBaseService;

import java.io.IOException;

import static ru.mycrg.wrapper.service.geoserver.GeoServerConstants.JSON_MEDIA_TYPE;

@Service
public class StorageService extends GeoServerBaseService {

    public void createStorage(final String databaseName, final String schemaName,
                              final String workspaceName, final String dataStoreName) throws IOException {
        log.debug("create storage: {}", dataStoreName);

        String host = postgisHost().split(":")[0];
        String port = postgisHost().split(":")[1];

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
