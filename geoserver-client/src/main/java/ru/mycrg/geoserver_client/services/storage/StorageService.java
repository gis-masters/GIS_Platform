package ru.mycrg.geoserver_client.services.storage;

import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import ru.mycrg.geoserver_client.GeoserverClientResponse;
import ru.mycrg.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;

public class StorageService extends GeoServerBaseService {

    public StorageService(String accessToken) {
        super(accessToken);
    }

    public GeoserverClientResponse createStorage(final String databaseName, final String schemaName,
                                                 final String workspaceName, final String dataStoreName) {
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

        return doRequest(request);
    }

    public DataStores getStores(final String workspaceName) throws GeoserverClientException {
        Request getStores = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/workspaces/" + workspaceName + "/datastores")
                .get()
                .build();

        try (Response response = httpClient.newCall(getStores).execute()) {
            return getDataFromResponse(response);
        } catch (Exception e) {
            throw new GeoserverClientException("Geoserver error", e.getMessage());
        }
    }

    private DataStores getDataFromResponse(Response response) {
        DataStores dataStores = new DataStores();
        try {
            return mapper
                    .readValue(response.body().string(), DataStoreResponse.class)
                    .getDataStores();
        } catch (Exception e) {
            return dataStores;
        }
    }

    public GeoserverClientResponse deleteStorage(final String workspaceName, final String dataStoreName) {
        Request request = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/workspaces/" + workspaceName + "/datastores/" + dataStoreName + "?recurse=true")
                .delete()
                .build();

        return doRequest(request);
    }
}
