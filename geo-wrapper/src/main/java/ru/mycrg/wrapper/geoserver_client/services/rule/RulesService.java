package ru.mycrg.wrapper.geoserver_client.services.rule;

import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.configurationprocessor.json.JSONObject;
import org.springframework.stereotype.Service;
import ru.mycrg.wrapper.geoserver_client.services.GeoServerBaseService;

import java.util.HashMap;
import java.util.Map;

import static ru.mycrg.wrapper.geoserver_client.GeoServerConstants.JSON_MEDIA_TYPE;
import static ru.mycrg.wrapper.geoserver_client.GeoServerConstants.XML_MEDIA_TYPE;

@Service
public class RulesService extends GeoServerBaseService {

    private static final Logger log = LoggerFactory.getLogger(RulesService.class);

    /**
     * Добавить правило доступа роли к определенному ресурсу.
     * Вставляет правило если таковое отсутствует или добавляет роль к уже существующему ресурсу.
     *
     * @param rule Правило доступа к ресурсу
     * @param role Роль
     */
    public void addLayersRule(String rule, String role) throws Exception {
        log.debug("addLayersRule: Rule: {} Role: {}", rule, role);

        Request getLayersRoles = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getAccessToken())
                .url("http://" + geoserverHost() + "/geoserver/rest/security/acl/layers")
                .get()
                .build();

        Response response = httpClient.newCall(getLayersRoles).execute();
        if (response.isSuccessful()) {
            Map<String, String> oldRules = new ObjectMapper().readValue(response.body().string(), HashMap.class);
            String valueByKey = oldRules.get("scratch_workspace.*.a");
            if (valueByKey != null) {
                valueByKey = valueByKey + "," + role;

                Map<String, String> payload = new HashMap<>();
                payload.put("scratch_workspace.*.a", valueByKey);

                updateLayersRoles(payload);
            } else {
                createRule(rule, role);
            }
        } else {
            response.close();
        }
    }

    /**
     * Роль будет добавлена в два существующих на геосерве правила: <p>
     * <p>
     * "/**:POST,DELETE,PUT": "ROLE_ADMINISTRATOR", <br>
     * "/**:GET": "ROLE_ADMINISTRATOR",
     *
     * @param role Наименование роли
     */
    public void addRestRule(String role) throws Exception {
        log.info("addRestRule for Role: {}", role);

        Request getRestRoles = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getAccessToken())
                .url("http://" + geoserverHost() + "/geoserver/rest/security/acl/rest")
                .get()
                .build();

        Response response = httpClient.newCall(getRestRoles).execute();
        if (response.isSuccessful()) {

            Map<String, String> oldRules = new ObjectMapper().readValue(response.body().string(), HashMap.class);
            Map<String, String> newRules = insertNewRole(oldRules, role, null);

            updateRestRoles(newRules);
        } else {
            response.close();
        }
    }

    /**
     * Добавить роль для заданного сервиса <p>
     *
     * @param serviceKeys Service rule key
     * @param role        Наименование роли
     */
    public void addServiceRule(ServiceKeys serviceKeys, String role) throws Exception {
        log.info("add role {} for service: {}", role, serviceKeys);

        Request getServiceRoles = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getAccessToken())
                .url("http://" + geoserverHost() + "/geoserver/rest/security/acl/services")
                .get()
                .build();

        Response response = httpClient.newCall(getServiceRoles).execute();
        if (response.isSuccessful()) {
            Map<String, String> newRules = new HashMap<>();

            Map<String, String> oldRules = new ObjectMapper().readValue(response.body().string(), HashMap.class);
            String serviceRoles = oldRules.get(serviceKeys.getRuleKey());
            if (serviceRoles != null) {
                serviceRoles = serviceRoles + "," + role;

                newRules.put(serviceKeys.getRuleKey(), serviceRoles);

                updateServiceRoles(newRules);
            } else {
                newRules.put(serviceKeys.getRuleKey(), role);

                createServiceRoles(newRules);
            }
        } else {
            response.close();
        }
    }

    /**
     * Добавить роль к правилу доступа.
     * Если указана ключевое правило то работаем только с ним, если не указано то роль добавляется ко всем правилам.
     * <p>
     * Examples:
     * "/**:POST,DELETE,PUT":"ROLE_ADMINISTRATOR,admin_workspace_1",
     * "/**:GET":"ROLE_ADMINISTRATOR,admin_workspace_1",
     * "scratch_workspace.*.a": "admin_2,admin_1"
     */
    public Map<String, String> insertNewRole(Map<String, String> oldRules, @NotNull String newRole, String keyRule) {
        if (keyRule != null) {
            oldRules.entrySet().forEach(item -> {
                if (keyRule.equals(item.getKey())) {
                    String oldRoles = item.getValue();

                    item.setValue(oldRoles + "," + newRole);
                }
            });
        } else {
            oldRules.entrySet().forEach(item -> {
                String oldRoles = item.getValue();

                item.setValue(oldRoles + "," + newRole);
            });
        }

        return oldRules;
    }

    private void createRule(String rule, String role) throws Exception {
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

    private void updateRestRoles(Map<String, String> newRules) throws Exception {
        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, new JSONObject(newRules).toString());
        Request setRestRoles = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getAccessToken())
                .url("http://" + geoserverHost() + "/geoserver/rest/security/acl/rest")
                .put(body)
                .build();
        doRequest(setRestRoles, "updateRestRoles");
    }

    private void updateServiceRoles(Map<String, String> newRules) throws Exception {
        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, new JSONObject(newRules).toString());

        Request setServiceRoles = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getAccessToken())
                .url("http://" + geoserverHost() + "/geoserver/rest/security/acl/services")
                .put(body)
                .build();

        doRequest(setServiceRoles, "updateServiceRoles");
    }

    private void createServiceRoles(Map<String, String> rule) throws Exception {
        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, new JSONObject(rule).toString());

        Request request = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getAccessToken())
                .url("http://" + geoserverHost() + "/geoserver/rest/security/acl/services")
                .post(body)
                .build();

        doRequest(request, "createServiceRoles");
    }

    private void updateLayersRoles(Map<String, String> newRules) throws Exception {
        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, new JSONObject(newRules).toString());
        Request setRestRoles = new Request.Builder()
                .addHeader("Authorization", "Bearer " + getAccessToken())
                .url("http://" + geoserverHost() + "/geoserver/rest/security/acl/layers")
                .put(body)
                .build();
        doRequest(setRestRoles, "updateLayersRoles");
    }
}
