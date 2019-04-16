package ru.mycrg.wrapper.service.geoserver.user_role;

import okhttp3.Request;
import okhttp3.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.wrapper.service.geoserver.GeoServerBaseService;
import ru.mycrg.wrapper.service.geoserver.GeoServerConstants;

import java.io.IOException;

@Service
public class UsersAndRolesService extends GeoServerBaseService {

    private static final Logger log = LoggerFactory.getLogger(UsersAndRolesService.class);

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
    public void associateUserWithRole(String userName, String role) throws IOException {
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
            return userName;
        }

        String[] splited = userName.split("\\.");
        if (splited.length > 1) {
            return String.join(".", splited[0], splited[1], splited[1]);
        } else {
            return userName;
        }
    }

}
