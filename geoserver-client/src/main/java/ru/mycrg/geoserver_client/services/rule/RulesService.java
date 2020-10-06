package ru.mycrg.geoserver_client.services.rule;

import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.geoserver_client.GeoserverClientResponse;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;
import static ru.mycrg.geoserver_client.GeoserverClient.XML_MEDIA_TYPE;
import static ru.mycrg.geoserver_client.services.rule.GeoServerPermissions.*;
import static ru.mycrg.geoserver_client.services.rule.RulesUtil.*;

public class RulesService extends GeoServerBaseService {

    private static final Logger log = LoggerFactory.getLogger(RulesService.class);

    public RulesService(String accessToken) {
        super(accessToken);
    }

    /**
     * Добавить правило доступа роли к определенному ресурсу.
     * Вставляет правило если таковое отсутствует или добавляет роль к уже существующему ресурсу.
     *
     * @param rule Правило доступа к ресурсу
     * @param role Роль
     */
    public void addLayersRule(String rule, String role) throws Exception {
        Request getLayersRoles = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/security/acl/layers")
                .get()
                .build();

        Response response = httpClient.newCall(getLayersRoles).execute();

        log.debug("addLayersRule: {} - {} / code: {}", rule, role, response.code());

        if (response.isSuccessful()) {
            Map<String, String> oldRules = mapper.readValue(response.body().string(), HashMap.class);
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
     * Delete all: admin, read and write rules by workspaceName
     * @param workspaceName
     */
    public void deleteResourceRule(String workspaceName) {
        String adminRule = buildRule(workspaceName, ADMIN);
        String readRule = buildRule(workspaceName, READ);
        String writeRule = buildRule(workspaceName, WRITE);

        deleteRule(adminRule);
        deleteRule(readRule);
        deleteRule(writeRule);
    }

    /**
     * Роль будет добавлена в два существующих на геосерве правила: <p>
     * <p>
     * "/**:POST,DELETE,PUT": "ROLE_ADMINISTRATOR", <br>
     * "/**:GET": "ROLE_ADMINISTRATOR",
     *
     * @param role Наименование роли
     */
    public void addRestRule(String role) {
        Request getRestRoles = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/security/acl/rest")
                .get()
                .build();

        try (Response response = httpClient.newCall(getRestRoles).execute()) {
            if (response.isSuccessful()) {

                Map<String, String> oldRules = mapper.readValue(response.body().string(), HashMap.class);
                Map<String, String> newRules = insertNewRole(oldRules, role, null);

                updateRestRoles(newRules);
            }
        } catch (IOException e) {
            log.error("Can't add rest roles");
        }
    }

    public void deleteRestRule(String role) {
        Request getRestRoles = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/security/acl/rest")
                .get()
                .build();

        try (Response response = httpClient.newCall(getRestRoles).execute()) {
            if (response.isSuccessful()) {
                Map<String, String> oldRules = mapper.readValue(response.body().string(), HashMap.class);
                Map<String, String> newRules = deleteRole(oldRules, role);

                updateRestRoles(newRules);
            } else {
                log.warn("Can't get rest rules, Code: {}, Reason: {}",
                        response.code(),
                        response.message());
            }
        } catch (IOException e) {
            log.error("Can't delete rest roles");
        }
    }

    /**
     * Добавить роль для заданного сервиса <p>
     *
     * @param serviceKeys Service rule key
     * @param role        Наименование роли
     */
    public void addServiceRule(ServiceKeys serviceKeys, String role) throws Exception {
        Request getServiceRoles = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/security/acl/services")
                .get()
                .build();

        Response response = httpClient.newCall(getServiceRoles).execute();
        if (response.isSuccessful()) {
            Map<String, String> newRules = new HashMap<>();

            Map<String, String> oldRules = mapper.readValue(response.body().string(), HashMap.class);
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

    public void deleteServiceRule(String role) {
        Request getServiceRoles = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/security/acl/services")
                .get()
                .build();

        try (Response response = httpClient.newCall(getServiceRoles).execute()) {
            if (response.isSuccessful()) {
                Map<String, String> oldRules = mapper.readValue(response.body().string(), HashMap.class);
                Map<String, String> newRules = deleteRole(oldRules, role);

                updateServiceRoles(newRules);
            } else {
                log.warn("Can't get service rules, Code: {}, Reason: {}",
                        response.code(),
                        response.message());
            }
        } catch (IOException e) {
            log.error("Can't delete services roles");
        }
    }

    private void deleteRule(String rule) {
        Request request = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/security/acl/layers/" + rule)
                .delete()
                .build();

        doRequest(request, "delete layers rule: " + rule);
    }

    private GeoserverClientResponse createRule(String rule, String role) {
        RequestBody body = RequestBody.create(XML_MEDIA_TYPE,
                "<rules>\n" +
                "   <rule resource=\"" + rule + "\">" + role + "</rule>\n" +
                "</rules>");

        Request request = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/security/acl/layers")
                .post(body)
                .build();

        return doRequest(request);
    }

    private GeoserverClientResponse updateRestRoles(Map<String, String> newRules) {
        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, new JSONObject(newRules).toString());
        Request setRestRoles = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/security/acl/rest")
                .put(body)
                .build();

        return doRequest(setRestRoles);
    }

    private GeoserverClientResponse updateServiceRoles(Map<String, String> newRules) {
        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, new JSONObject(newRules).toString());

        Request setServiceRoles = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/security/acl/services")
                .put(body)
                .build();

        return doRequest(setServiceRoles);
    }

    private GeoserverClientResponse createServiceRoles(Map<String, String> rule) {
        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, new JSONObject(rule).toString());

        Request request = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/security/acl/services")
                .post(body)
                .build();

        return doRequest(request);
    }

    private GeoserverClientResponse updateLayersRoles(Map<String, String> newRules) {
        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, new JSONObject(newRules).toString());
        Request setRestRoles = builderWithBearerAuth
                .url(getGeoserverRestUrl() + "/security/acl/layers")
                .put(body)
                .build();

        return doRequest(setRestRoles);
    }

}
