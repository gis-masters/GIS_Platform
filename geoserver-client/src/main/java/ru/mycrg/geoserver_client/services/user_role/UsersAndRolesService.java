package ru.mycrg.geoserver_client.services.user_role;

import okhttp3.Request;
import okhttp3.RequestBody;
import ru.mycrg.geoserver_client.GeoserverClientResponse;
import ru.mycrg.geoserver_client.exceptions.GeoserverClientException;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;
import static ru.mycrg.geoserver_client.GeoserverClient.XML_ATOM_MEDIA_TYPE;

public class UsersAndRolesService extends GeoServerBaseService {

    public UsersAndRolesService() {
    }

    public GeoserverClientResponse createRole(String role) throws GeoserverClientException {
        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, "");

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getRootAccessToken())
                .url(getGeoserverRestUrl() + "/security/roles/role/" + role)
                .post(body)
                .build();

        return doRequest(request);
    }

    public GeoserverClientResponse createUser(String user, String password) throws GeoserverClientException {
        RequestBody body = RequestBody.create(XML_ATOM_MEDIA_TYPE,
                "<user>\n" +
                "    <enabled>true</enabled>\n" +
                "    <userName>" + user + "</userName>\n" +
                "    <password>" + password + "</password>\n" +
                "</user>");

        String url = String.format("%s/security/usergroup/service/%s/users",
                getGeoserverRestUrl(), geoserverInfo.getUserServiceName());

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getRootAccessToken())
                .url(url)
                .post(body)
                .build();

        return doRequest(request);
    }

    public GeoserverClientResponse deleteUser(String userName) throws GeoserverClientException {
        String url = String.format("%s/security/usergroup/service/%s/user/%s",
                getGeoserverRestUrl(), geoserverInfo.getUserServiceName(), userName);

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getRootAccessToken())
                .url(url)
                .delete()
                .build();

        return doRequest(request);
    }

    // https://docs.geoserver.org/2.13.2/user/rest/api/userrole.html
    // /rest/roles/[service/<serviceName>/]role/<role>/user/<user>
    public GeoserverClientResponse associateUserWithRole(String userName, String role) throws GeoserverClientException {
        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, "");

        String cName = prepareUserNameForGeoserver(userName);

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getRootAccessToken())
                .url(getGeoserverRestUrl() + "/security/roles/role/" + role + "/user/" + cName)
                .post(body)
                .build();

        return doRequest(request);
    }

    // Вот тут (org/geoserver/rest/security/RolesRestController.java) видно что прилетающее имя пользователя, например:
    // "admin@mail.ru" обрезается до "admin@mail" а
    // "admin@mail.ru.ru" обрезается до "admin@mail.ru" Где обрезается и зачем не искал.
    // Цель метода продублировать то что за точкой, чтобы на геосервере, после обрезки получить нормальное имя
    // пользователя - email. Никаких извращений писать не буду предусматриваю только валидный e-mail
    public String prepareUserNameForGeoserver(String userName) {
        if (userName == null) {
            return null;
        }

        String[] splitByAt = userName.split("@");
        String lastPartOfEmail = splitByAt[1];

        String[] splitByDot = lastPartOfEmail.split("\\.");
        if (splitByDot.length > 1) {
            return splitByAt[0] + "@" + splitByDot[0] + "." + splitByDot[1] + "." + splitByDot[1];
        } else {
            return userName;
        }
    }

}
