package ru.mycrg.integration_service.bpmn.gpkg.export.vector;

import okhttp3.Request;
import okhttp3.Response;
import org.camunda.bpm.engine.delegate.BpmnError;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.export.ExportGpkgPayload;
import ru.mycrg.data_service_contract.dto.ExportResourceModel;
import ru.mycrg.data_service_contract.queue.request.gpkg.ExportGpkgEvent;
import ru.mycrg.http_client.JsonConverter;
import ru.mycrg.integration_service.bpmn.BaseHttpService;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.JsonNode;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.export.GpkgExportType.LAYER;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("askVectorTableAvailability")
public class AskVectorTableAvailability implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(AskVectorTableAvailability.class);

    private final BaseHttpService baseHttpService;
    private final GpkgReportManager reportManager;

    public AskVectorTableAvailability(BaseHttpService baseHttpService,
                                      GpkgReportManager reportManager) {
        this.baseHttpService = baseHttpService;
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        int currentIteration = (int) delegateExecution.getVariable(EXPORT_GPKG_COUNT_HTTP_ERRORS);
        if (currentIteration >= 4) {
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "allResourcesUnavailable");

            return;
        }

        log.debug("Класс '{}' начал работу.", AskVectorTableAvailability.class.getSimpleName());

        //Шаг 1. Проверили что мы вообще можем работать.
        ExportGpkgPayload subPayload = (ExportGpkgPayload) delegateExecution.getVariable(EXPORT_GPKG_SUB_PAYLOAD);
        List<ExportResourceModel> resources;
        if (subPayload.getType() == LAYER) {
            resources = (List<ExportResourceModel>) delegateExecution.getVariable(EXPORT_GPKG_VECTOR_LIST);
        } else {
            resources = extractResourcesFromPayload(subPayload);
        }

        if (resources.isEmpty()) {
            log.error("Невозможно продолжать выполнение экспорта векторных таблиц. Останавливаем процесс!");
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "allResourcesUnavailable");

            return;
        }

        resources = resources.stream().distinct().collect(Collectors.toList());

        //Шаг 2. Собрать список недоступных ресурсов (Доступные у нас как бы есть).
        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EXPORT_GPKG_EVENT);
        String token = event.getToken();
        List<ExportResourceModel> unavailableResources = checkAccessOnDataService(currentIteration,
                                                                                  delegateExecution,
                                                                                  resources,
                                                                                  token);

        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);

        //Шаг 3. Отправляем отчёт в процесс + обнуляем попытки + двигаем процесс
        //Для каждого ресурса создаём отчёт о том что мы будем его выгружать.
        reportManager.createTablesReport(rabbitDto, event.getGpkgReport(), resources);

        if (unavailableResources.isEmpty()) {
            log.debug("Пользователю доступны все указанные ресурсы.");

            subPayload.setPayload(resources);
            delegateExecution.setVariable(EXPORT_GPKG_COUNT_HTTP_ERRORS, 0);
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "someResourcesAvailable");
            delegateExecution.setVariable(EXPORT_GPKG_VECTOR_LIST, asJava(resources));
        } else {
            log.debug("Количество недоступных ресурсов: {}", unavailableResources.size());

            reportManager.errorTableRepByIdentifiers(rabbitDto,
                                                     event.getGpkgReport(),
                                                     unavailableResources);

            resources.removeAll(unavailableResources);

            if (!resources.isEmpty()) {
                log.debug("После проверки доступности ресурсов осталось: {}", resources.size());

                delegateExecution.setVariable(EXPORT_GPKG_COUNT_HTTP_ERRORS, 0);
                delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "someResourcesAvailable");
                delegateExecution.setVariable(EXPORT_GPKG_VECTOR_LIST, asJava(resources));
            } else {
                log.debug("После проверки, пользователю недоступны все ресурсы.");
                delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "allResourcesUnavailable");
            }
        }
    }

    private List<ExportResourceModel> checkAccessOnDataService(int currentIteration,
                                                               DelegateExecution delegateExecution,
                                                               List<ExportResourceModel> resources,
                                                               String token) {
        List<ExportResourceModel> unavailableResources = new ArrayList<>();

        for (ExportResourceModel resource: resources) {
            try (Response response = fetchTableByIdentifier(resource, token)) {
                if (response.isSuccessful()) {
                    String responseBody = response.body() != null ? response.body().string() : null;
                    log.debug("body: {}", responseBody);
                    JsonNode rootNode = objectMapper.readTree(responseBody);
                    JsonNode contentNode = rootNode.has("content") ? rootNode.get("content") : rootNode;
                    String permission;
                    if (contentNode.isArray() && !contentNode.isEmpty()) {
                        permission = contentNode.get(0).get("role").asText();
                    } else {
                        permission = contentNode.get("role").asText(); // для случая когда это не массив
                    }

                    if (!permission.equals("OWNER")) {
                        log.debug("Пользователь НЕ является владельцем ресурса: {}/{}",
                                  resource.getDataset(),
                                  resource.getTable());

                        unavailableResources.add(resource);
                    }
                } else {
                    int statusCode = response.code();
                    log.debug("Data сервис вернул неуспешный статус: {} для ресурса {}/{}",
                              statusCode, resource.getDataset(), resource.getTable());

                    // Временные ошибки - можно повторить
                    if (statusCode == 503 || statusCode == 502 || statusCode == 504 || statusCode == 429) {
                        delegateExecution.setVariable(EXPORT_GPKG_COUNT_HTTP_ERRORS, currentIteration + 1);

                        throw new BpmnError("responseTimeOut");
                    }

                    unavailableResources.add(resource);
                }
            } catch (IOException e) {
                log.debug("Ошибка ввода-вывода при запросе ресурса {}/{}: {}",
                          resource.getDataset(), resource.getTable(), e.getMessage(), e);
                delegateExecution.setVariable(EXPORT_GPKG_COUNT_HTTP_ERRORS, currentIteration + 1);

                throw new BpmnError("responseTimeOut");
            } catch (Exception e) {
                log.debug("Ошибка при запросе ресурса {}/{}: {}",
                          resource.getDataset(), resource.getTable(), e.getMessage(), e);

                unavailableResources.add(resource);
            }
        }

        return unavailableResources;
    }

    private Response fetchTableByIdentifier(ExportResourceModel resource, String token) throws IOException {
        URL dataServiceUrl = baseHttpService.getDataServiceUrl();
        URL exportUrl = new URL(dataServiceUrl,
                                "/datasets/" + resource.getDataset() + "/tables/" + resource.getTable());

        Request request = new Request.Builder()
                .url(exportUrl)
                .get()
                .addHeader("Authorization", "Bearer " + token)
                .build();

        return BaseHttpService.httpClient.newCall(request).execute();
    }

    /**
     * subPayload может быть сформирован либо нашим кодом на прошлом шаге, тогда он легко добывается. Либо его нам
     * передали как OBJECT из самого начала и тогда он может быть ещё и не корректным.
     *
     * @return объекты либо пустой массив
     */
    private List<ExportResourceModel> extractResourcesFromPayload(ExportGpkgPayload subPayload) {
        Object payload = subPayload.getPayload();

        // Сначала проверяем, не является ли это уже правильным типом
        if (payload instanceof List) {
            List<?> list = (List<?>) payload;
            if (!list.isEmpty()) {
                Object firstElement = list.get(0);
                if (firstElement instanceof ExportResourceModel) {
                    return (List<ExportResourceModel>) payload;
                }
            }
        }

        try {
            String jsonPayload = JsonConverter.toJson(payload);

            TypeReference<List<ExportResourceModel>> typeRef = new TypeReference<>() {
            };

            return JsonConverter.fromJson(jsonPayload, typeRef).orElse(new ArrayList<>());
        } catch (Exception e) {
            log.error("Не удалось конвертировать payload в List<ExportResourceModel>: {}", e.getMessage(), e);

            return Collections.emptyList();
        }
    }
}
