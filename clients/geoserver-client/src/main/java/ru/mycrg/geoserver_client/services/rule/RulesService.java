package ru.mycrg.geoserver_client.services.rule;

import okhttp3.Request;
import okhttp3.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import ru.mycrg.geoserver_client.services.GeoServerBaseService;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;

import java.util.HashMap;
import java.util.Map;

import static ru.mycrg.geoserver_client.GeoserverClient.JSON_MEDIA_TYPE;
import static ru.mycrg.geoserver_client.GeoserverClient.XML_MEDIA_TYPE;
import static ru.mycrg.geoserver_client.services.rule.GeoServerPermissions.*;
import static ru.mycrg.geoserver_client.services.rule.RulesUtil.*;
import static ru.mycrg.http_client.JsonConverter.toJson;

public class RulesService extends GeoServerBaseService {

    private final Logger log = LoggerFactory.getLogger(RulesService.class);

    public static final String LAYERS_URL = getGeoserverRestUrl() + "/security/acl/layers/";
    public static final String REST_URL = getGeoserverRestUrl() + "/security/acl/rest";
    public static final String SERVICES_URL = getGeoserverRestUrl() + "/security/acl/services";

    public RulesService(String accessToken) {
        super(accessToken);
    }

    /**
     * Добавить правило доступа роли к определенному ресурсу. Вставляет правило если таковое отсутствует или добавляет
     * роль к уже существующему ресурсу.
     *
     * @param rule Правило доступа к ресурсу
     * @param role Роль
     */
    public void addLayersRule(String rule, String role) throws HttpClientException {
        Request getLayersRoles = builderWithBearerAuth.url(LAYERS_URL)
                                                      .get().build();

        ResponseModel<HashMap> response = httpClient.handleRequest(getLayersRoles, HashMap.class);

        log.debug("addLayersRule: {} - {} / code: {}", rule, role, response.getCode());

        if (response.isSuccessful()) {
            Map<String, String> oldRules = response.getBody();
            String valueByKey = oldRules.get("scratch_workspace.*.a");
            if (valueByKey != null) {
                valueByKey = valueByKey + "," + role;

                Map<String, String> payload = new HashMap<>();
                payload.put("scratch_workspace.*.a", valueByKey);

                updateLayersRoles(payload);
            } else {
                createRule(rule, role);
            }
        }
    }

    /**
     * Delete all: admin, read and write rules by workspaceName
     *
     * @param workspaceName Название проекта
     */
    public void deleteResourceRule(String workspaceName) throws HttpClientException {
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
     * "/**:POST,DELETE,PUT": "ROLE_ADMINISTRATOR", <br> "/**:GET": "ROLE_ADMINISTRATOR",
     *
     * @param role Наименование роли
     */
    public void addRestRule(String role) throws HttpClientException {
        Request getRestRoles = builderWithBearerAuth.url(REST_URL)
                                                    .get().build();

        ResponseModel<HashMap> response = httpClient.handleRequest(getRestRoles, HashMap.class);

        if (response.isSuccessful()) {
            Map<String, String> oldRules = response.getBody();
            Map<String, String> newRules = insertNewRole(oldRules, role, null);

            updateRestRoles(newRules);
        } else {
            throw new HttpClientException("Не удалось добавить роль к ресурсу: rest");
        }
    }

    public ResponseModel<HashMap> getRestRules() throws HttpClientException {
        Request getRestRoles = builderWithBearerAuth.url(REST_URL)
                                                    .get().build();

        return httpClient.handleRequest(getRestRoles, HashMap.class);
    }

    public void deleteRestRule(String role) throws HttpClientException {
        Request getRestRoles = builderWithBearerAuth.url(REST_URL)
                                                    .get().build();

        ResponseModel<HashMap> response = httpClient.handleRequest(getRestRoles, HashMap.class);
        if (response.isSuccessful()) {
            Map<String, String> oldRules = response.getBody();
            Map<String, String> newRules = deleteRole(oldRules, role);

            updateRestRoles(newRules);
        } else {
            throw new HttpClientException("Не удалось удалить роль ресурса: rest");
        }
    }

    /**
     * Добавить роль для заданного сервиса <p>
     *
     * @param serviceKeys Service rule key
     * @param role        Наименование роли
     */
    public void addServiceRule(ServiceKeys serviceKeys, String role) throws HttpClientException {
        Request getServiceRoles = builderWithBearerAuth.url(SERVICES_URL)
                                                       .get().build();

        ResponseModel<HashMap> response = httpClient.handleRequest(getServiceRoles, HashMap.class);
        if (response.isSuccessful()) {
            Map<String, String> newRules = new HashMap<>();

            Map<String, String> oldRules = response.getBody();
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
            throw new HttpClientException("Не удалось добавить роль к ресурсу: services");
        }
    }

    public ResponseModel<?> getServiceRules() throws HttpClientException {
        Request getServiceRoles = builderWithBearerAuth.url(SERVICES_URL)
                                                       .get().build();

        return httpClient.handleRequest(getServiceRoles, HashMap.class);
    }

    public void deleteServiceRule(String role) throws HttpClientException {
        Request getServiceRoles = builderWithBearerAuth.url(SERVICES_URL)
                                                       .get().build();

        ResponseModel<HashMap> response = httpClient.handleRequest(getServiceRoles, HashMap.class);
        if (response.isSuccessful()) {
            Map<String, String> oldRules = response.getBody();
            Map<String, String> newRules = deleteRole(oldRules, role);

            updateServiceRoles(newRules);
        } else {
            throw new HttpClientException("Не удалось удалить роль ресурса: services");
        }
    }

    private void deleteRule(String rule) throws HttpClientException {
        Request request = builderWithBearerAuth.url(LAYERS_URL + rule)
                                               .delete().build();

        log.debug("try delete rule: {}", rule);
        final ResponseModel<Object> responseModel = httpClient.handleRequest(request);
        if (!responseModel.isSuccessful()) {
            log.warn("Failed delete layer rule: {}. Response Model: {}", rule, responseModel);
        } else {
            log.debug("Success delete rule: {}", responseModel);
        }
    }

    private void createRule(String rule, String role) throws HttpClientException {
        RequestBody body = RequestBody.create(
                XML_MEDIA_TYPE,
                "<rules>" +
                        "   <rule resource=\"" + rule + "\">" + role + "</rule>" +
                        "</rules>");

        Request request = builderWithBearerAuth.url(LAYERS_URL)
                                               .post(body).build();

        ResponseModel<String> response = httpClient.handleRequestAsString(request);
        if (!response.isSuccessful()) {
            throw new HttpClientException("Не удалось добавить роль к ресурсу: layers: " + response);
        }
    }

    private void updateRestRoles(Map<String, String> newRules) throws HttpClientException {
        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, toJson(newRules));
        Request setRestRoles = builderWithBearerAuth.url(REST_URL)
                                                    .put(body).build();

        ResponseModel<String> response = httpClient.handleRequestAsString(setRestRoles);
        if (!response.isSuccessful()) {
            throw new HttpClientException("Не удалось обновить роли ресурса: rest: " + response);
        }
    }

    private void updateServiceRoles(Map<String, String> newRules) throws HttpClientException {
        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, toJson(newRules));

        Request setServiceRoles = builderWithBearerAuth.url(SERVICES_URL)
                                                       .put(body).build();

        ResponseModel<String> response = httpClient.handleRequestAsString(setServiceRoles);
        if (!response.isSuccessful()) {
            throw new HttpClientException("Не удалось обновить роли ресурса: Service: " + response);
        }
    }

    private void createServiceRoles(Map<String, String> rule) throws HttpClientException {
        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, toJson(rule));

        Request request = builderWithBearerAuth.url(SERVICES_URL)
                                               .post(body).build();

        ResponseModel<Object> response = httpClient.handleRequest(request, Object.class);
        if (!response.isSuccessful()) {
            throw new HttpClientException("Не удалось создать роль для ресурса: Service", response);
        }
    }

    private void updateLayersRoles(Map<String, String> newRules) throws HttpClientException {
        RequestBody body = RequestBody.create(JSON_MEDIA_TYPE, toJson(newRules));
        Request setRestRoles = builderWithBearerAuth.url(LAYERS_URL)
                                                    .put(body).build();

        ResponseModel<Object> response = httpClient.handleRequest(setRestRoles, Object.class);
        if (!response.isSuccessful()) {
            throw new HttpClientException("Не удалось обновить роли ресурса: layers", response);
        }
    }
}
