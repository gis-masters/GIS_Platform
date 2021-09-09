package ru.mycrg.geoserver_client.services.feature_types;

import com.google.gson.JsonSyntaxException;
import okhttp3.Request;
import okhttp3.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;

public class FeatureTypeService extends GeoServerBaseService implements IFeatureTypes {

    private final Logger log = LoggerFactory.getLogger(FeatureTypeService.class);

    public static final String WORKSPACES = "/workspaces/";
    public static final String DATA_STORES = "/datastores/";

    public FeatureTypeService(String accessToken) {
        super(accessToken);
    }

    public FeatureTypes getFeatures(String workspaceName, String dataStoreName) throws HttpClientException {
        log.debug("try get all features from workspace: {} dataset: {}", workspaceName, dataStoreName);

        String url = getGeoserverRestUrl()
                .append(WORKSPACES).append(workspaceName)
                .append(DATA_STORES).append(dataStoreName)
                .append("/featuretypes.json").toString();

        Request request = builderWithBearerAuth.url(url)
                                               .get().build();

        try {
            return httpClient.handleRequest(request, FeaturesResponse.class)
                             .getBody()
                             .getFeatureTypes();
        } catch (JsonSyntaxException e) {
            return new FeatureTypes();
        }
    }

    @Override
    public ResponseModel<Object> create(String workspaceName, String dataStoreName, String featureName, Integer srs)
            throws HttpClientException {
        log.debug("try create feature: {} in: {}", featureName, workspaceName);

        RequestBody body = RequestBody.create(
                JSON_MEDIA_TYPE,
                "{\"featureType\": " +
                    "{" +
                        "\"name\": \"" + featureName + "\"," +
                        "\"nativeCRS\": \"EPSG:" + srs.toString() + "\"" +
                    "}" +
                "}");

        String url = getGeoserverRestUrl()
                .append(WORKSPACES).append(workspaceName)
                .append(DATA_STORES).append(dataStoreName)
                .append("/featuretypes").toString();

        Request request = builderWithBearerAuth.url(url)
                                               .post(body).build();

        log.debug("create feature: {} on datastore: {}", featureName, dataStoreName);

        return httpClient.handleRequest(request);
    }

    @Override
    public void delete(String workspaceName, String dataStoreName, String featureName) throws HttpClientException {
        log.debug("try delete feature: {} in: {}", featureName, workspaceName);

        String url = getGeoserverRestUrl()
                .append(WORKSPACES).append(workspaceName)
                .append(DATA_STORES).append(dataStoreName)
                .append("/featuretypes/").append(featureName)
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
