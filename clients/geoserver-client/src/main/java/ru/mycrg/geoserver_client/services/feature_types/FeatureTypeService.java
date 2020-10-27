package ru.mycrg.geoserver_client.services.feature_types;

import okhttp3.Request;
import okhttp3.RequestBody;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;

public class FeatureTypeService extends GeoServerBaseService implements IFeatureTypes {

    public FeatureTypeService(String accessToken) {
        super(accessToken);
    }

    @Override
    public void create(String workspaceName, String dataStoreName, String featureName, Integer srs)
            throws HttpClientException {
        RequestBody body = RequestBody.create(
                JSON_MEDIA_TYPE,
                "{\"featureType\": " +
                "{" +
                "\"name\": \"" + featureName + "\"," +
                "\"nativeCRS\": \"EPSG:" + srs.toString() + "\"" +
                "}" +
                "}");

        String url = getGeoserverRestUrl()
                .append("/workspaces/").append(workspaceName)
                .append("/datastores/").append(dataStoreName)
                .append("/featuretypes").toString();

        Request request = builderWithBearerAuth.url(url)
                                               .post(body).build();

        httpClient.handleRequest(request);
    }

    @Override
    public void delete(String workspaceName, String dataStoreName, String featureName) throws HttpClientException {
        String url = getGeoserverRestUrl()
                .append("/workspaces/").append(workspaceName)
                .append("/datastores/").append(dataStoreName)
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
