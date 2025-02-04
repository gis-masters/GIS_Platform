package ru.mycrg.geoserver_client.services.feature_types;

import okhttp3.Request;
import okhttp3.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.geoserver_client.contracts.featuretypes.FeatureTypeModel;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;
import static ru.mycrg.http_client.JsonConverter.toJson;

public class FeatureTypeService extends GeoServerBaseService implements IFeatureTypes {

    private final Logger log = LoggerFactory.getLogger(FeatureTypeService.class);

    private static final String WORKSPACES = "/workspaces/";
    private static final String DATA_STORES = "/datastores/";
    private static final String FEATURE_TYPES = "/featuretypes/";

    public FeatureTypeService(String accessToken) {
        super(accessToken);
    }

    public FeatureTypes getFeatureTypes(String workspace,
                                        String dataStore) {
        log.debug("try get all features from workspace: {} dataset: {}", workspace, dataStore);

        String url = getGeoserverRestUrl()
                .append(WORKSPACES).append(workspace)
                .append(DATA_STORES).append(dataStore)
                .append(FEATURE_TYPES).toString();

        Request request = builderWithBearerAuth.url(url)
                                               .get().build();

        try {
            return httpClient.handleRequest(request, FeaturesResponse.class)
                             .getBody()
                             .getFeatureTypes();
        } catch (Exception e) {
            return new FeatureTypes();
        }
    }

    public boolean isExist(String workspace,
                           String featureType) {
        String url = getGeoserverRestUrl()
                .append(WORKSPACES).append(workspace)
                .append(FEATURE_TYPES).append(featureType)
                .append(".json").toString();

        Request request = builderWithBearerAuth.url(url).get().build();

        log.debug("Проверка наличия featureType: [{}] в рабочей области: [{}] Request: [{}]",
                  featureType, workspace, request);

        try {
            return httpClient.handleRequest(request).isSuccessful();
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public ResponseModel<Object> create(String workspace,
                                        String dataStore,
                                        FeatureTypeModel featureType) throws HttpClientException {
        String payload = toJson(new FeatureTypeWrapModel(featureType));

        log.debug("try create new featureType: [{}] in workspace: '{}'", payload, workspace);

        String url = getGeoserverRestUrl()
                .append(WORKSPACES).append(workspace)
                .append(DATA_STORES).append(dataStore)
                .append(FEATURE_TYPES).toString();

        Request request = builderWithBearerAuth.url(url)
                                               .post(RequestBody.create(JSON_MEDIA_TYPE, payload))
                                               .build();

        return httpClient.handleRequest(request);
    }

    @Override
    public void delete(String workspace,
                       String dataStore,
                       String featureType) throws HttpClientException {
        log.debug("try delete featureType: {} in: {}", featureType, workspace);

        String url = getGeoserverRestUrl()
                .append(WORKSPACES).append(workspace)
                .append(DATA_STORES).append(dataStore)
                .append(FEATURE_TYPES).append(featureType)
                .toString();

        Request request = builderWithBearerAuth
                .url(url)
                .delete()
                .build();

        final ResponseModel<Object> response = httpClient.handleRequest(request, Object.class);

        if (!response.isSuccessful() && response.getCode() != 404 && response.getCode() != 403) {
            throw new HttpClientException("Delete featureType error: ");
        }
    }
}
