package ru.mycrg.geoserver_client.services.storage.vector;

import okhttp3.Request;
import okhttp3.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.geoserver_client.contracts.datastores.base.IParameterizedStore;
import ru.mycrg.geoserver_client.contracts.datastores.base.ParameterizedDataStoreWrapper;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;
import static ru.mycrg.http_client.JsonConverter.toJson;

public class VectorStorage extends GeoServerBaseService {

    private final Logger log = LoggerFactory.getLogger(VectorStorage.class);

    public static final String WORKSPACES = "/workspaces/";
    public static final String DATA_STORES = "/datastores/";

    public VectorStorage(String accessToken) {
        super(accessToken);
    }

    /**
     * Adds a new PostGis data store to the workspace.
     *
     * @param workspaceName The name of the workspace containing the data stores.
     */
    public ResponseModel<Object> create(String workspaceName,
                                        IParameterizedStore<?> dataStore) throws HttpClientException {
        String json = toJson(new ParameterizedDataStoreWrapper(dataStore));

        log.debug("Request to create dataStore, with params: {}", json);

        Request request = builderWithBearerAuth
                .url(getGeoserverRestUrl() + WORKSPACES + workspaceName + DATA_STORES)
                .post(RequestBody.create(JSON_MEDIA_TYPE, json))
                .build();

        ResponseModel<String> responseModel = httpClient.handleRequestAsString(request);

        return new ResponseModel<>(responseModel, responseModel.getBody());
    }

    /**
     * Get list all data stores in workspace.
     *
     * @param workspaceName The name of the workspace containing the data stores.
     */
    public DataStoreWrapper getAll(final String workspaceName) {
        Request getStores = builderWithBearerAuth
                .url(getGeoserverRestUrl() + WORKSPACES + workspaceName + DATA_STORES)
                .get()
                .build();

        try {
            return httpClient.handleRequest(getStores, DataStoreResponse.class)
                             .getBody()
                             .getDataStores();
        } catch (Exception e) {
            return new DataStoreWrapper();
        }
    }

    /**
     * Deletes a data store from the server. All resources contained in the store are also removed.
     *
     * @param workspaceName The name of the workspace containing the data store.
     * @param dataStoreName The name of the data store to delete.
     */
    public ResponseModel<Object> delete(String workspaceName,
                                        String dataStoreName) throws HttpClientException {
        String url = getGeoserverRestUrl() +
                WORKSPACES + workspaceName +
                DATA_STORES + dataStoreName + "?recurse=true";

        Request request = builderWithBearerAuth.url(url).delete().build();

        return httpClient.handleRequest(request);
    }
}
