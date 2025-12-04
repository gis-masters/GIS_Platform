package ru.mycrg.data_service.service;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.auth_facade.IAuthenticationFacade;
import ru.mycrg.data_service_contract.dto.ImportLayerReport;
import ru.mycrg.gis_service_contract.dto.ProjectBaseProjection;
import ru.mycrg.http_client.HttpClient;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.http_client.exceptions.HttpClientException;
import ru.mycrg.http_client.handlers.BaseRequestHandler;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.Map;
import java.util.Optional;

import static ru.mycrg.common_contracts.enums.Roles.VIEWER;
import static ru.mycrg.data_service.config.CrgCommonConfig.DEFAULT_MEDIA_TYPE;

@Service
public class ProjectsClient {

    private final Logger log = LoggerFactory.getLogger(ProjectsClient.class);

    private final URL gisServiceUrl;
    private final HttpClient httpClient;
    private final IAuthenticationFacade authenticationFacade;

    public ProjectsClient(Environment environment,
                          IAuthenticationFacade authenticationFacade) throws MalformedURLException {
        this.authenticationFacade = authenticationFacade;

        this.httpClient = new HttpClient(new BaseRequestHandler(new OkHttpClient()));
        this.gisServiceUrl = new URL(environment.getRequiredProperty("crg-options.gis-service-url"));
    }

    /**
     * Проверяет, доступен ли проект для записи.
     *
     * @param projectId идентификатор проекта
     *
     * @return true, если проект недоступен для записи (только просмотр или ошибка)
     */
    public boolean isProjectNotAllowed(Long projectId) {
        try {
            Request request = new Request.Builder()
                    .addHeader("Authorization", "Bearer " + authenticationFacade.getAccessToken())
                    .url(new URL(gisServiceUrl, "/projects/" + projectId))
                    .get()
                    .build();

            ResponseModel<ProjectBaseProjection> responseModel =
                    httpClient.handleRequest(request, ProjectBaseProjection.class);
            if (responseModel.isSuccessful()) {
                return responseModel.getBody()
                                    .getRole()
                                    .equals(VIEWER);
            } else {
                return true;
            }
        } catch (HttpClientException | MalformedURLException e) {
            return true;
        }
    }

    /**
     * Добавляет слой в проект.
     *
     * @param projectId     идентификатор проекта
     * @param groupId       идентификатор группы
     * @param dataStoreName имя хранилища данных
     * @param dataset       идентификатор набора данных
     * @param layerReport   отчет об импорте слоя
     */
    public void joinLayer(Long projectId,
                          Long groupId,
                          String dataStoreName,
                          String dataset,
                          ImportLayerReport layerReport) {
        try {
            RequestBody payload = RequestBody.create(DEFAULT_MEDIA_TYPE, "{" +
                    "    \"resourceId\": \"" + layerReport.getTableIdentifier() + "\"," +
                    "    \"type\": \"vector\"," +
                    "    \"title\": \"" + layerReport.getTableTitle() + "\"," +
                    "    \"dataset\": \"" + dataset + "\"," +
                    "    \"nativeCRS\": \"" + layerReport.getCrs() + "\"," +
                    "    \"dataStoreName\": \"" + dataStoreName + "\"," +
                    "    \"parentId\": \"" + groupId + "\"," +
                    "    \"enabled\": true," +
                    "    \"schemaId\": \"" + layerReport.getSchemaId() + "\"," +
                    "    \"styleName\": \"" + layerReport.getStyleName() + "\"" +
                    "}");

            Request request = new Request.Builder()
                    .addHeader("Authorization", "Bearer " + authenticationFacade.getAccessToken())
                    .url(new URL(gisServiceUrl, String.format("/projects/%d/layers", projectId)))
                    .post(payload)
                    .build();

            httpClient.handleRequest(request);
        } catch (Exception e) {
            String msg = String.format("Не удалось добавить слой %s к проекту: %d",
                                       layerReport.getTableIdentifier(), projectId);
            log.error("{} => {}", msg, e.getMessage());
        }
    }

    /**
     * Создает группу в проекте.
     *
     * @param projectId  идентификатор проекта
     * @param groupTitle название группы
     *
     * @return Optional с идентификатором созданной группы, или пустой Optional при ошибке
     */
    @SuppressWarnings("unchecked")
    public Optional<Long> createGroup(Long projectId, String groupTitle) {
        try {
            RequestBody payload = RequestBody.create(DEFAULT_MEDIA_TYPE,
                                                     "{\"title\": \"" + groupTitle + "\"}");

            Request request = new Request.Builder()
                    .addHeader("Authorization", "Bearer " + authenticationFacade.getAccessToken())
                    .url(new URL(gisServiceUrl, String.format("/projects/%d/groups", projectId)))
                    .post(payload)
                    .build();

            Map<String, Object> result = (Map<String, Object>) httpClient.handleRequest(request).getBody();
            Long id = (long) Double.parseDouble(result.get("id").toString());

            return Optional.of(id);
        } catch (Exception e) {
            return Optional.empty();
        }
    }
}

