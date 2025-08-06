package ru.mycrg.geoserver_client.services.user_role;

import okhttp3.Request;
import okhttp3.RequestBody;
import ru.mycrg.geoserver_client.dto.UserGeoserverDto;
import ru.mycrg.geoserver_client.dto.UserGeoserverDtoWrapper;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.util.List;

import static java.util.Objects.nonNull;
import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;
import static ru.mycrg.http_client.JsonConverter.toJson;

public class UsersAndRolesService extends GeoServerBaseService {

    public UsersAndRolesService(String accessToken) {
        super(accessToken);
    }

    public void createRole(String role) throws HttpClientException {
        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, "");

        Request request = builderWithBearerAuth.url(getGeoserverRestUrl() + "/security/roles/role/" + role)
                                               .post(body).build();

        httpClient.handleRequestAsString(request);
    }

    public void deleteRole(String roleName) throws HttpClientException {
        Request request = builderWithBearerAuth.url(getGeoserverRestUrl() + "/security/roles/role/" + roleName)
                                               .delete().build();

        httpClient.handleRequest(request);
    }

    public List<String> getUserRoles(String userName) throws HttpClientException {
        Request request = builderWithBearerAuth.url(
                                                       getGeoserverRestUrl() + "/security/roles/user/" + userName + ".json")
                                               .get().build();

        GeoserverRoleResponse body = httpClient.handleRequest(request, GeoserverRoleResponse.class).getBody();

        return nonNull(body) ? body.getRoles() : List.of();
    }

    public ResponseModel<String> createUser(String login, String password) throws HttpClientException {
        UserGeoserverDtoWrapper user = new UserGeoserverDtoWrapper(new UserGeoserverDto(login, password, true));
        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, toJson(user));

        String url = String.format("%s/security/usergroup/service/%s/users",
                                   getGeoserverRestUrl(), geoserverInfo.getUserServiceName());

        Request request = builderWithBearerAuth.url(url)
                                               .post(body).build();

        return httpClient.handleRequestAsString(request);
    }

    public ResponseModel<Object> deleteUser(String userName) throws HttpClientException {
        String url = String.format("%s/security/usergroup/service/%s/user/%s",
                                   getGeoserverRestUrl(), geoserverInfo.getUserServiceName(), userName);

        Request request = builderWithBearerAuth.url(url)
                                               .delete().build();

        return httpClient.handleRequest(request);
    }

    // https://docs.geoserver.org/2.13.2/user/rest/api/userrole.html
    // /rest/roles/[service/<serviceName>/]role/<role>/user/<user>
    public ResponseModel<String> associateUserWithRole(String userName, String role) throws HttpClientException {
        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, "");

        Request request = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/security/roles/role/" + role + "/user/" + userName)
                .post(body).build();

        return httpClient.handleRequestAsString(request);
    }

    // https://docs.geoserver.org/2.13.2/user/rest/api/userrole.html
    // /rest/roles/[service/<serviceName>/]role/<role>/user/<user>
    public ResponseModel<Object> disassociateUserWithRole(String userName, String role) throws HttpClientException {
        Request request = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/security/roles/role/" + role + "/user/" + userName)
                .delete().build();

        return httpClient.handleRequest(request);
    }

    // Вот тут (org/geoserver/rest/security/RolesRestController.java) видно, что прилетающее имя пользователя, например:
    // "test@mail.ru" обрезается до "test@mail" а
    // "test@mail.ru.ru" обрезается до "test@mail.ru" Где обрезается и зачем не искал.
    // Цель метода продублировать то что за точкой, чтобы на геосервере, после обрезки получить нормальное имя
    // пользователя - email. Никаких извращений писать не буду, предусматриваю только валидный e-mail
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
