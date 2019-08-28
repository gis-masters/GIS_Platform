package ru.mycrg.wrapper.geoserver_client.services.user_role;

import okhttp3.Request;
import okhttp3.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.wrapper.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.wrapper.geoserver_client.GeoServerConstants;

@Service
public class UsersAndRolesService extends GeoServerBaseService {

    private static final Logger log = LoggerFactory.getLogger(UsersAndRolesService.class);

    public void createRole(String role) throws Exception {
        log.debug("create role: {}", role);

        RequestBody body = RequestBody.create(GeoServerConstants.JSON_MEDIA_TYPE, "");

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getAccessToken())
                .url("http://" + geoserverHost() + "/geoserver/rest/security/roles/role/" + role)
                .post(body)
                .build();

        doRequest(request, "createRole");
    }

    public void createUser(String user, String password) throws Exception {
        log.debug("create user: {}", user);

        RequestBody body = RequestBody.create(GeoServerConstants.XML_ATOM_MEDIA_TYPE,
                "<user>\n" +
                        "    <enabled>true</enabled>\n" +
                        "    <userName>" + user + "</userName>\n" +
                        "    <password>" + password + "</password>\n" +
                        "</user>");

        String url = String.format("http://%s/geoserver/rest/security/usergroup/service/%s/users",
                geoserverHost(), userServiceName());

        log.debug("createUserUrl: {}", url);
        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getAccessToken())
                .url(url)
                .post(body)
                .build();

        doRequest(request, "createUser");
    }

    // https://docs.geoserver.org/2.13.2/user/rest/api/userrole.html
    // /rest/roles/[service/<serviceName>/]role/<role>/user/<user>
    public void associateUserWithRole(String userName, String role) throws Exception {
        log.debug("Try associate User: {} With role: {}", userName, role);

        RequestBody body = RequestBody.create(GeoServerConstants.JSON_MEDIA_TYPE, "");

        String cName = castyl(userName);

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getAccessToken())
                .url("http://" + geoserverHost() + "/geoserver/rest/security/roles/role/" + role + "/user/" + cName)
                .post(body)
                .build();

        doRequest(request, "associateUserWithRole");
    }

    // Вот тут (org/geoserver/rest/security/RolesRestController.java) видно что прилетающее имя пользователя, например:
    // "admin@mail.ru" обрезается до "admin@mail" а
    // "admin@mail.ru.ru" обрезается до "admin@mail.ru" Где обрезается и зачем не искал.
    // Цель костыля продублировать то что за точкой, чтобы на геосервере, после обрезки получить нормальное имя
    // пользователя - email. Никаких извращений писать не буду предусматриваю только валидный e-mail
    public String castyl(String userName) {
        if (userName == null) {
            return null;
        }

        String[] splited = userName.split("\\.");
        if (splited.length > 1) {
            return String.join(".", splited[0], splited[1], splited[1]);
        } else {
            return userName;
        }
    }

}
