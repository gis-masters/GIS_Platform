package ru.mycrg.geoserver_client.services.feature_types;

import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import ru.mycrg.geoserver_client.GeoserverClientResponse;
import ru.mycrg.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;

public class FeatureTypeService extends GeoServerBaseService implements IFeatureTypes {

    @Override
    public GeoserverClientResponse create(String workspaceName, String dataStoreName, String featureName,
                                          String jwtToken, Integer srs) {
        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE,
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

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + jwtToken)
                .url(url)
                .post(body)
                .build();

        return doRequest(request);
    }

    @Override
    public void delete(String workspaceName, String dataStoreName, String featureName, String jwtToken)
            throws GeoserverClientException {

        String url = getGeoserverRestUrl()
                .append("/workspaces/").append(workspaceName)
                .append("/datastores/").append(dataStoreName)
                .append("/featuretypes/").append(featureName)
                .toString();

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + jwtToken)
                .url(url)
                .delete()
                .build();

        Response response;
        try {
            response = httpClient.newCall(request).execute();

            if (!response.isSuccessful()) {
                if (response.code() != 404 && response.code() != 403) {
                    throw new GeoserverClientException("Delete featureType error: ", response.message());
                }
            }

            response.close();
        } catch (Exception e) {
            throw new GeoserverClientException("delete featureType failed", e.getMessage());
        }
    }
}
