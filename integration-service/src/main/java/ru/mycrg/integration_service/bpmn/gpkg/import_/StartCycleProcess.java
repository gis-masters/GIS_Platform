package ru.mycrg.integration_service.bpmn.gpkg.import_;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import org.camunda.bpm.engine.delegate.BpmnError;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgImportReport;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgPayloadData;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTablesData;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgWrapperImportReport;
import ru.mycrg.data_service_contract.dto.ErrorReport;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.integration_service.bpmn.BaseHttpService;

import java.util.Optional;

import static ru.mycrg.integration_service.bpmn.BaseHttpService.crgHttpClient;
import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.VariableUtil.getVariable;

/**
 * Класс для импорта GPKG. (Четвёртый в цепочке)
 *
 * <h3>Репорт на этом этапе:</h3>
 * <ul>
 *   <li>Количество и состав таблиц которые внутри gpkg</li>
 *   <li>Есть описание сущности "Проект"</li>
 *
 *   <li>С каждым тиком цикла будет прибавляться информация о таблицах, слоях, стилях</li>
 * </ul>
 */

@Service("startCycleProcess")
public class StartCycleProcess implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(StartCycleProcess.class);

    private final BaseHttpService baseHttpService;

    public StartCycleProcess(BaseHttpService baseHttpService) {
        this.baseHttpService = baseHttpService;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        long neededCyclesCount = (long) delegateExecution.getVariable(NEEDED_CYCLES_COUNT_VAR_NAME);
        int performedCyclesCount = (int) delegateExecution.getVariable(PERFORMED_CYCLES_COUNT_VAR_NAME);
        log.debug("Количество итераций нужно: {}", neededCyclesCount);
        log.debug("Количество итераций было выполнено: {}", performedCyclesCount);

        if (neededCyclesCount > performedCyclesCount) {
            log.debug("Класс {} начал работать.", StartCycleProcess.class.getSimpleName());
            ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);

            GpkgImportReport importReport = (GpkgImportReport) delegateExecution.getVariable(
                    EVENT_IMPORT_GPKG_REPORT_NAME);
            GpkgPayloadData subPayload = importReport.getPayload();

            if (performedCyclesCount == 0) {
                log.debug("Мы первый раз в процессе -> нужно добавить отчёт geoWrapper и создать группу в проекте.");

                ErrorReport geoWrapperReport = (ErrorReport) delegateExecution.getVariable(FAIL_REASON);
                GpkgWrapperImportReport gwIr = new GpkgWrapperImportReport(geoWrapperReport.getFailedRecordCount(),
                                                                           geoWrapperReport.getUtf8ErrorCount());
                subPayload.setWrapperImportReport(gwIr);
                importReport.setPayload(subPayload);

                Optional<Long> groupId = createParentGroup(event.getToken(),
                                                           event.getProjectId(),
                                                           event.getTargetDatasetTitle(),
                                                           delegateExecution);
                if (groupId.isPresent()) {
                    delegateExecution.setVariable(CREATED_LAYER_GROUP_ID, groupId.get());
                    delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, 0);
                } else {
                    delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "bigMistake");

                    return;
                }
            }

            GpkgTablesData currentTable = subPayload.getTablesInGpkg().get(performedCyclesCount);

            performedCyclesCount++;
            delegateExecution.setVariable(PERFORMED_CYCLES_COUNT_VAR_NAME, performedCyclesCount);
            delegateExecution.setVariable(ENTITY_ID_VAR_NAME, asJava(currentTable));
            delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, 0);
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "haveOneMoreObject");
        } else {
            log.debug("Переходим на ветку завершения.");
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "doneAll");
        }
    }

    private Optional<Long> createParentGroup(String token,
                                             Long projectId,
                                             String title,
                                             DelegateExecution delegateExecution) {
        int currentIteration = (int) getVariable(delegateExecution, ITERATION_COUNTER_VAR_NAME, getClass().getName());
        if (currentIteration >= 4) {
            log.warn("Превышено максимальное количество попыток создания группы ({})", currentIteration);

            return Optional.empty();
        }

        String jsonBody = "{"
                + "\"title\": \"" + title + "\","
                + "\"enabled\": true,"
                + "\"expanded\": true,"
                + "\"position\": -1,"
                + "\"transparency\": 100"
                + "}";

        RequestBody requestBody = RequestBody.create(
                MediaType.parse("application/json"),
                jsonBody
        );

        String fullUrl = baseHttpService.getGisServiceUrl() + "/projects/" + projectId + "/groups";
        log.debug("fullUrl: {}", fullUrl);

        Request request = new Request.Builder()
                .url(fullUrl)
                .post(requestBody)
                .addHeader("Content-Type", "application/json")
                .addHeader("Authorization", "Bearer " + token)
                .build();

        try {
            ResponseModel<String> response = crgHttpClient.handleRequestAsString(request);
            if (response.isSuccessful()) {
                String responseBody = response.getBody();
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode jsonNode = objectMapper.readTree(responseBody);

                return Optional.of(jsonNode.get("id").asLong());
            } else {
                int statusCode = response.getCode();
                log.warn("GIS сервис вернул неуспешный статус: {} для создания группы в проекте с ID: {}", statusCode,
                         projectId);

                // Временные ошибки - можно повторить
                if (statusCode == 503 || statusCode == 502 || statusCode == 504 || statusCode == 429) {
                    delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, currentIteration + 1);
                    throw new BpmnError("responseTimeOut");
                }
            }
        } catch (Exception e) {
            log.error("Ошибка при создании группы в проекте с ID {}: {}", projectId, e.getMessage(), e);
            delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, currentIteration + 1);

            throw new BpmnError("responseTimeOut");
        }

        return Optional.empty();
    }
}
