package ru.mycrg.data_service.service.resource_analyze.analyzers;

import com.fasterxml.jackson.databind.JsonNode;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.RecordsDao;
import ru.mycrg.data_service.dto.record.IRecord;
import ru.mycrg.data_service.entity.SchemasAndTables;
import ru.mycrg.data_service.exceptions.BadRequestException;
import ru.mycrg.data_service.exceptions.ErrorInfo;
import ru.mycrg.data_service.repository.SchemasAndTablesRepository;
import ru.mycrg.data_service.util.JsonConverter;
import ru.mycrg.data_service.service.resources.ResourceQualifier;
import ru.mycrg.http_client.HttpClient;
import ru.mycrg.http_client.handlers.BaseRequestHandler;
import ru.mycrg.resource_analyzer_contract.IResource;
import ru.mycrg.resource_analyzer_contract.IResourceAnalyzer;
import ru.mycrg.resource_analyzer_contract.IResourceAnalyzerResult;
import ru.mycrg.resource_analyzer_contract.IResourceDefinition;
import ru.mycrg.resource_analyzer_contract.impl.ResourceAnalyzerResult;
import ru.mycrg.resource_analyzer_contract.impl.ResourceDefinition;

import java.net.MalformedURLException;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.Objects.nonNull;
import static ru.mycrg.data_service.dao.config.DaoProperties.PRIMARY_KEY;

@Service
public class ReglamentsExistenceAnalyzer implements IResourceAnalyzer {

    private final Logger log = LoggerFactory.getLogger(ReglamentsExistenceAnalyzer.class);

    private final RecordsDao recordsDao;
    private final SchemasAndTablesRepository schemasAndTablesRepository;

    private final HttpClient httpClient;
    private final URL gisServiceUrl;
    private final URL uiServiceUrl;

    public ReglamentsExistenceAnalyzer(Environment environment,
                                       RecordsDao recordsDao,
                                       SchemasAndTablesRepository schemasAndTablesRepository)
            throws MalformedURLException {
        this.recordsDao = recordsDao;
        this.schemasAndTablesRepository = schemasAndTablesRepository;

        this.httpClient = new HttpClient(new BaseRequestHandler(new OkHttpClient()));
        this.gisServiceUrl = new URL(environment.getRequiredProperty("crg-options.gis-service-url"));
        this.uiServiceUrl = new URL(environment.getRequiredProperty("crg-options.ui-service-url"));
    }

    @Override
    public List<IResourceAnalyzerResult> analyze(List<? extends IResource> resources) {
        checkResourcesForAppropriateType(resources);

        return resources.stream()
                        .map(this::analyzeResource)
                        .collect(Collectors.toUnmodifiableList());
    }

    @Override
    public List<IResourceDefinition> getResourceDefinitions() {
        return List.of(new ResourceDefinition("Reglaments", "Регламенты"));
    }

    @Override
    public String getId() {
        return "ReglamentsExistenceAnalyzer";
    }

    @Override
    public String getTitle() {
        return "Проверка существования регламентов";
    }

    @Override
    public String getErrorMessageTemplate() {
        return "Регламент не доступен по url {url}";
    }

    @Override
    public int getBatchSize() {
        return 20;
    }

    @Override
    public URL getReceiveDataUrl() {
        return gisServiceUrl;
    }

    private ResourceAnalyzerResult analyzeResource(IResource layer) {
        boolean passed = true;
        String dataset = layer.getResourceProperties().get("dataset").toString();
        String tableName = layer.getResourceProperties().get("tableName").toString();
        ResourceQualifier tableQualifier = new ResourceQualifier(dataset, tableName);

        List<IRecord> records = recordsDao.findAll(tableQualifier, null, null);
        Map<String, String> objectsInfo = getUrls(records);

        for (Map.Entry<String, String> info: objectsInfo.entrySet()) {
            if (!passed) {
                checkReglamentsByUrl(info.getKey(), info.getValue(), layer.getResourceProperties());
            } else {
                passed = checkReglamentsByUrl(info.getKey(), info.getValue(), layer.getResourceProperties());
            }
        }

        return new ResourceAnalyzerResult(layer.getId(), passed);
    }

    private boolean checkReglamentsByUrl(String objectId, String url, Map<String, Object> layerProps) {
        Response response = null;
        String schemasAndTablesTitle = "";
        boolean passed = true;
        String dataset = layerProps.get("dataset").toString();
        String tableName = layerProps.get("tableName").toString();
        String tableTitle = layerProps.get("title").toString();

        Optional<SchemasAndTables> schemasAndTables = schemasAndTablesRepository.findByIdentifier(dataset);
        if (schemasAndTables.isPresent()) {
            schemasAndTablesTitle = schemasAndTables.get().getTitle();
        }

        try {
            Request request = new Request.Builder()
                    .url(new URL(uiServiceUrl, url))
                    .get()
                    .build();

            response = httpClient.getRequestHandler().handle(request);
            if (!response.isSuccessful()) {
                String responseBody = "";
                if (nonNull(response.body())) {
                    responseBody = response.body().string();
                }

                log.warn("Не удалось получить регламент объекта в наборе данных:{}, имя таблицы: {}, objectId: {}, " +
                                 "таблица в базе данных:{}.{}, по url: {}, ответ: {}", schemasAndTablesTitle,
                         tableTitle, objectId, dataset, tableName, url, responseBody);

                passed = false;
            }
        } catch (Exception e) {
            log.warn("При попытке получить регламент по url: {}, возникла ошибка: {}", url, e.getMessage());
            passed = false;
        } finally {
            if (nonNull(response)) {
                response.close();
            }
        }

        return passed;
    }

    /**
     * Берем ссылки только из столбца "link", т.к. не можем из схемы однозначно определить наличие регламентов, на
     * данный момент все ссылки на регламенты лежат в таких столбцах, но это не гарантированно в дальнейшем.
     */
    private Map<String, String> getUrls(List<IRecord> recordDtos) {
        Map<String, String> urls = new HashMap<>();
        recordDtos.forEach(r -> {
            if (nonNull(r.getContent().get("link"))) {
                JsonNode linkNode = JsonConverter.toJsonNodeFromString(
                        r.getContent().get("link").toString());
                String objectId = r.getContent().get(PRIMARY_KEY).toString();
                if (nonNull(linkNode.get("url"))) {
                    String url = linkNode.get("url").toString().replace("\"", "");
                    urls.put(objectId, url);
                }
            }
        });

        return urls;
    }

    private void checkResourcesForAppropriateType(List<? extends IResource> resources) {
        final String NEEDED = "должен быть указан";
        final String NOT_VALID_DESCRIPTION = "Не подходит описание ресурса";
        resources.forEach(resource -> {

            if (!getResourceDefinitions().contains(resource.getResourceDefinition())) {
                String message = "Требуется: type:Reglaments и typeTitle:Регламенты";
                throw new BadRequestException(NOT_VALID_DESCRIPTION, new ErrorInfo("resourceDefinition", message));
            }

            if (resource.getResourceProperties().get("dataset") == null) {
                throw new BadRequestException(NOT_VALID_DESCRIPTION,
                                              new ErrorInfo("resourceProperties.dataset", NEEDED));
            }

            if (resource.getResourceProperties().get("tableName") == null) {
                throw new BadRequestException(NOT_VALID_DESCRIPTION,
                                              new ErrorInfo("resourceProperties.tableName", NEEDED));
            }
        });
    }
}
