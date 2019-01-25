package ru.mycrg.wrapper.service.geoserver.rule;

import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Service;
import ru.mycrg.wrapper.service.geoserver.GeoServerBaseService;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static ru.mycrg.wrapper.service.geoserver.GeoServerConstants.JSON_MEDIA_TYPE;
import static ru.mycrg.wrapper.service.geoserver.GeoServerConstants.XML_MEDIA_TYPE;

@Service
public class RulesService extends GeoServerBaseService {

    private static final Logger log = LoggerFactory.getLogger(RulesService.class);

    public void addLayersRule(String rule, String role) throws IOException {
        RequestBody body = RequestBody.create(XML_MEDIA_TYPE,
                "<rules>\n" +
                        "   <rule resource=\"" + rule + "\">" + role + "</rule>\n" +
                        "</rules>");

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getAccessToken())
                .url("http://" + geoserverHost() + "/geoserver/rest/security/acl/layers")
                .post(body)
                .build();

        doRequest(request, "addLayersRule");
    }

    /**
     * Роль будет добавлена в два существующих на геосерве правила: <p>
     * <p>
     * "/**:POST,DELETE,PUT": "ROLE_ADMINISTRATOR", <br>
     * "/**:GET": "ROLE_ADMINISTRATOR",
     *
     * @param role Наименование роли
     * @throws IOException
     */
    public void addRestRule(String role) throws IOException {
        log.info("addRestRule for Role: {}", role);

        Request getRestRoles = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getAccessToken())
                .url("http://" + geoserverHost() + "/geoserver/rest/security/acl/rest")
                .get()
                .build();

        Response response = httpClient.newCall(getRestRoles).execute();
        if (response.isSuccessful()) {

            Map<String, String> oldRules = new ObjectMapper().readValue(response.body().string(), HashMap.class);
            Map<String, String> newRules = insertNewRole(oldRules, role);

            updateRestRoles(newRules);
        } else {
            response.close();
        }
    }

    // {"/**:POST,DELETE,PUT":"ROLE_ADMINISTRATOR,admin_workspace_1",
    //  "/**:GET":"ROLE_ADMINISTRATOR,admin_workspace_1",
    public Map<String, String> insertNewRole(Map<String, String> oldRules, @NotNull String newRole) {
        oldRules.entrySet().forEach(item -> {
            String oldRoles = item.getValue();

            item.setValue(oldRoles + "," + newRole);
        });

        return oldRules;
    }

    private void updateRestRoles(Map<String, String> newRules) throws IOException {
        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, new JSONObject(newRules).toString());
        Request setRestRoles = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getAccessToken())
                .url("http://" + geoserverHost() + "/geoserver/rest/security/acl/rest")
                .put(body)
                .build();
        doRequest(setRestRoles, "updateRestRoles");
    }
}
