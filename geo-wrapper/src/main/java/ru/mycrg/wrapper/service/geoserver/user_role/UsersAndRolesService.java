package ru.mycrg.wrapper.service.geoserver.user_role;

import okhttp3.Request;
import okhttp3.RequestBody;
import org.springframework.stereotype.Service;
import ru.mycrg.wrapper.service.geoserver.GeoServerBaseService;
import ru.mycrg.wrapper.service.geoserver.GeoServerConstants;

import java.io.IOException;

@Service
public class UsersAndRolesService extends GeoServerBaseService {

    public void createRole(String role) throws IOException {
        RequestBody body = RequestBody.create(GeoServerConstants.JSON_MEDIA_TYPE, "");

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getAccessToken())
                .url("http://" + geoserverHost() + "/geoserver/rest/security/roles/role/" + role)
                .post(body)
                .build();

        doRequest(request, "createRole");
    }

    public void createUser(String user, String password) throws IOException {
        RequestBody body = RequestBody.create(GeoServerConstants.XML_ATOM_MEDIA_TYPE,
                "<user>\n" +
                        "    <enabled>true</enabled>\n" +
                        "    <userName>" + user + "</userName>\n" +
                        "    <password>" + password + "</password>\n" +
                        "</user>");

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getAccessToken())
                .url("http://" + geoserverHost() + "/geoserver/rest/security/usergroup/users")
                .post(body)
                .build();

        doRequest(request, "createUser");
    }

    // https://docs.geoserver.org/2.13.2/user/rest/api/userrole.html
    // /rest/roles/[service/<serviceName>/]role/<role>/user/<user>
    public void associateUserWithRole(String user, String role) throws IOException {
        RequestBody body = RequestBody.create(GeoServerConstants.JSON_MEDIA_TYPE, "");

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getAccessToken())
                .url("http://" + geoserverHost() + "/geoserver/rest/security/roles/role/" + role + "/user/" + user)
                .post(body)
                .build();

        doRequest(request, "associateUserWithRole");
    }

}
