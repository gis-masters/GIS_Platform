package ru.mycrg.integration_service.bpmn.gpkg.import_.vector;

import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.camunda.bpm.engine.delegate.BpmnError;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.contents.GpkgContentsFeatures;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessReport;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.dto.TableModelProjection;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgAckInfoBackwardEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.integration_service.bpmn.BaseHttpService;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.COMPLETED;
import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.ERROR;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.http_client.JsonConverter.fromJson;
import static ru.mycrg.http_client.JsonConverter.toJson;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("createVectorTable")
public class CreateVectorTable implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(CreateVectorTable.class);

    private final BaseHttpService baseHttpService;
    private final GpkgReportManager reportManager;

    public CreateVectorTable(BaseHttpService baseHttpService,
                             GpkgReportManager reportManager) {
        this.baseHttpService = baseHttpService;
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс {} начал работу", CreateVectorTable.class.getSimpleName());
        int currentIteration = (int) delegateExecution.getVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS);
        if (currentIteration >= 4) {
            log.warn("Превышено максимальное количество попыток создания таблицы ({})", currentIteration);

            throw new BpmnError("noTablesCreated");
        }

        //Отчёт враппера - общий для каждой итерации цикла
        ImportGpkgAckInfoBackwardEvent backward = (ImportGpkgAckInfoBackwardEvent)
                delegateExecution.getVariable(IMPORT_GPKG_BACKWARD_EXTRACTED_DATA);

        //Отчёт для поэтапного сохранения результатов обработки - общий для каждой итерации цикла (постоянно растёт)
        GpkgProcessReport importReport = (GpkgProcessReport) delegateExecution
                .getVariable(IMPORT_GPKG_EVENT_REPORT);

        //Таблица зафиксированная в шаге запуска цикла - новая при каждой итерации
        GpkgContentsFeatures currentTable = (GpkgContentsFeatures) delegateExecution
                .getVariable(IMPORT_GPKG_CURRENT_VECTOR_TABLE);

        //Информация о таблице, считанная из GPKG, должна равняться 'currentTable' + SchemaDto
        ResourceProjection dataToTableCreate = backward.getTable();

        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(IMPORT_GPKG_EVENT);
        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);

        if (dataToTableCreate == null) {
            /*
              Флоу такой: data-service говорит что будем создавать, integration-service пытается выполнить.
              Если data-service плохо отработал - integration-service идёт дальше.
             */
            String msg = "Не хватает информации для создания новой векторной таблицы.";
            breakStepAndOut(msg, backward, currentTable.getTableName(), importReport, rabbitDto);

            throw new BpmnError("noTablesCreated");
        }

        //TODO: сделать ResponseModel, какой вообще Closeable у запрос-ответ http общения ?-)
        //TODO: нормально использовать Optional
        try (Response response = createTable(event.getToken(),
                                             event.getTargetDatasetIdentifier(),
                                             dataToTableCreate,
                                             delegateExecution,
                                             currentIteration)) {
            if (response.isSuccessful() && response.body() != null) {
                String responseBody = response.body().string();

                Optional<TableModelProjection> tableResponse = fromJson(responseBody, TableModelProjection.class);
                if (tableResponse.isPresent()) {
                    String newIdentifier = tableResponse.get().getIdentifier();

                    reportManager.updateTableRepByIdentifier(rabbitDto, importReport, COMPLETED, newIdentifier,
                                                             tableResponse.get().getTitle(),
                                                             currentTable.getTableName());

                    delegateExecution.setVariable(IMPORT_GPKG_CREATED_TABLE_NAME, newIdentifier);
                }

                // Сбрасываем счетчик итераций при успешном выполнении
                delegateExecution.setVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS, 0);
            } else {
                String msg = "Таблица не была создана. Подробнее в логе data-service.";
                log.warn(msg);
                breakStepAndOut(msg, backward, currentTable.getTableName(), importReport, rabbitDto);

                throw new BpmnError("noTablesCreated");
            }
        } catch (BpmnError e) {
            // Пробрасываем BpmnError дальше (это наши ретраи или глобальные ошибки)
            throw e;
        } catch (Exception e) {
            log.error("Неожиданная ошибка при создании таблицы: {}", e.getMessage(), e);
            delegateExecution.setVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS, currentIteration + 1);

            throw new BpmnError("responseTimeOut");
        }
    }

    private Response createTable(String token,
                                 String targetDatasetIdentifier,
                                 ResourceProjection table,
                                 DelegateExecution delegateExecution,
                                 int currentIteration) throws IOException {
        log.debug("Создаём векторную таблицу.");
        table.setType("TABLE");

        URL dataServiceUrl = baseHttpService.getDataServiceUrl();
        URL exportUrl = new URL(dataServiceUrl, "/datasets/" + targetDatasetIdentifier + "/tables");

        normalizeDto(table);

        RequestBody requestBody = RequestBody.create(
                MediaType.parse("application/json"),
                toJson(table));

        log.debug("Тело создания векторной таблицы {}", toJson(table));

        Request request = new Request.Builder()
                .url(exportUrl)
                .post(requestBody)
                .addHeader("Authorization", "Bearer " + token)
                .build();

        try {
            Response response = BaseHttpService.httpClient.newCall(request).execute();

            if (!response.isSuccessful()) {
                int statusCode = response.code();
                log.warn("Data сервис вернул неуспешный статус: {} для создания таблицы в датасете: {}", statusCode,
                         targetDatasetIdentifier);

                // Временные ошибки - можно повторить
                if (statusCode == 503 || statusCode == 502 || statusCode == 504 || statusCode == 429) {
                    delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, currentIteration + 1);

                    throw new BpmnError("responseTimeOut");
                }
            }

            return response;
        } catch (IOException e) {
            log.error("Ошибка ввода-вывода при создании таблицы в датасете {}: {}", targetDatasetIdentifier,
                      e.getMessage(), e);
            delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, currentIteration + 1);

            throw new BpmnError("responseTimeOut");
        } catch (Exception e) {
            log.error("Ошибка при создании таблицы в датасете {}: {}", targetDatasetIdentifier, e.getMessage(), e);
            delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, currentIteration + 1);

            throw new BpmnError("responseTimeOut");
        }
    }

    private void breakStepAndOut(String msg, ImportGpkgAckInfoBackwardEvent backward, String identifier,
                                 GpkgProcessReport processReport, GpkgProcessContext rabbitDto) {
        log.error(msg);

        List<String> messages = new ArrayList<>();
        messages.add(msg);
        messages.add(backward.getErrorMessage());

        reportManager.updateTableRepByIdentifier(rabbitDto, processReport, ERROR, messages, identifier);
    }

    private void normalizeDto(ResourceProjection table) {
        if (table.getTitle() != null && table.getTitle().length() > 250) {
            table.setTitle(table.getTitle().substring(0, 250));
        }

        if (table.getDetails() != null && table.getDetails().length() > 1000) {
            table.setDetails(table.getDetails().substring(0, 1000));
        }
    }
}
