package ru.mycrg.integration_service.bpmn.gpkg.export;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
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

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.export.GpkgExportType.TABLE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.IntegrationApplication.objectMapper;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.VariableUtil.getVariable;

@Service("askVectorTableAvailability")
public class AskVectorTableAvailability implements JavaDelegate {

    private final Logger log = LoggerFactory.getLogger(AskVectorTableAvailability.class);

    private final BaseHttpService baseHttpService;
    private final GpkgReportManager reportManager;

    int currentIteration;

    public AskVectorTableAvailability(BaseHttpService baseHttpService,
                                      GpkgReportManager reportManager) {
        this.baseHttpService = baseHttpService;
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        currentIteration = (int) getVariable(delegateExecution, ITERATION_COUNTER_VAR_NAME, getClass().getName());
        if (currentIteration >= 4) {
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "allResourcesUnavailable");

            return;
        }

        log.debug("Класс '{}' начал работу.", AskVectorTableAvailability.class.getSimpleName());

        //Шаг 1. Проверили что мы вообще можем работать.
        ExportGpkgPayload subPayload = (ExportGpkgPayload) delegateExecution.getVariable(EVENT_SUB_PAYLOAD_NAME);
        if (subPayload.getType() != TABLE) {
            log.error("Экспорт без векторных таблиц невозможен. Останавливаем процесс!");
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "allResourcesUnavailable");

            return;
        }

        List<ExportResourceModel> resources = extractResourcesFromPayload(subPayload);
        resources = resources.stream().distinct().collect(Collectors.toList());

        //Шаг 2. Собрали список недоступных ресурсов (Доступные у нас как бы есть).
        String token = delegateExecution.getVariable(TOKEN_VAR_NAME).toString();
        List<ExportResourceModel> unavailableResources = checkAccessOnDataService(delegateExecution, resources, token);

        ExportGpkgEvent event = (ExportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);
        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);

        //Шаг 3. Отправляем отчёт в процесс + обнуляем попытки + двигаем процесс
        //Для каждого ресурса создаём отчёт о том что мы будем его выгружать.
        reportManager.createTablesReport(rabbitDto, event.getGpkgReport(), resources);

        if (unavailableResources.isEmpty()) {
            log.debug("Пользователю доступны все указанные ресурсы.");

            subPayload.setPayload(resources);
            delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, 0);
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "someResourcesAvailable");
        } else {
            log.debug("Количество недоступных ресурсов: {}", unavailableResources.size());

            reportManager.errorTableRepByIdentifiers(rabbitDto,
                                                     event.getGpkgReport(),
                                                     unavailableResources);

            resources.removeAll(unavailableResources);
            subPayload.setPayload(resources);

            if (!resources.isEmpty()) {
                log.debug("После проверки доступности ресурсов осталось: {}", resources.size());

                delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, 0);
                delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "someResourcesAvailable");
            } else {
                log.debug("После проверки, пользователю недоступны все ресурсы.");
                delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "allResourcesUnavailable");
            }
        }
    }

    private List<ExportResourceModel> checkAccessOnDataService(DelegateExecution delegateExecution,
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
                    if (contentNode.isArray() && contentNode.size() > 0) {
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
                        delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, currentIteration++);

                        throw new BpmnError("responseTimeOut");
                    }

                    unavailableResources.add(resource);
                }
            } catch (IOException e) {
                log.debug("Ошибка ввода-вывода при запросе ресурса {}/{}: {}",
                          resource.getDataset(), resource.getTable(), e.getMessage(), e);
                delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, currentIteration++);

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

            return new ArrayList<>();
        }
    }
}
