package ru.mycrg.wrapper.geoserver_client.services.feature_types;

import okhttp3.Request;
import okhttp3.RequestBody;
import org.springframework.stereotype.Service;
import ru.mycrg.wrapper.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.wrapper.geoserver_client.services.GeoServerBaseService;

import static ru.mycrg.wrapper.geoserver_client.GeoServerConstants.JSON_MEDIA_TYPE;

@Service
public class FeatureTypeService extends GeoServerBaseService implements IFeatureTypes {

    @Override
    public void create(String workspaceName, String dataStoreName, String featureName, String jwtToken, Integer srs)
            throws GeoserverClientException {

        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE,
                "{\"featureType\": " +
                    "{" +
                        "\"name\": \"" + featureName + "\"," +
                        "\"nativeCRS\": \"EPSG:" + srs.toString() + "\"" +
                    "}" +
                "}");

        String url = getRootRestUrl()
                .append("/workspaces/").append(workspaceName)
                .append("/datastores/").append(dataStoreName)
                .append("/featuretypes").toString();

        log.debug("create FeatureType with name: {} by URL: {}", featureName, url);

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + jwtToken)
                .url(url)
                .post(body)
                .build();

        doRequest(request, "create FeatureType");
    }

    @Override
    public void delete(String workspaceName, String dataStoreName, String featureName, String jwtToken)
            throws GeoserverClientException {

        String url = getRootRestUrl()
                .append("/workspaces/").append(workspaceName)
                .append("/datastores/").append(dataStoreName)
                .append("/featuretypes/").append(featureName)
                .toString();

        log.debug("delete FeatureType with name: {} by URL: {}", featureName, url);

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + jwtToken)
                .url(url)
                .delete()
                .build();

        doRequest(request, "delete FeatureType");
    }
}
