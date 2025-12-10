package ru.mycrg.integration_service.bpmn.gpkg.import_;

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
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.*;
import ru.mycrg.data_service_contract.dto.PatchProcess;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.queue.request.UpdateProcessEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgAckInfoBackwardEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgCopyDataBackwardEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.gis_service_contract.dto.LayerProjection;
import ru.mycrg.integration_service.bpmn.BaseHttpService;
import ru.mycrg.integration_service.bpmn.gpkg.GeoServerSpeaker;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.io.IOException;
import java.net.URL;
import java.util.List;
import java.util.Objects;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.COMPLETED;
import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.ERROR;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.http_client.JsonConverter.toJson;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;
import static ru.mycrg.integration_service.bpmn.VariableUtil.getVariable;

/**
 * Класс для импорта GPKG. (Седьмой в цепочке)
 *
 * <h3>Репорт на этом этапе:</h3>
 * <ul>
 *   <li>Количество и состав таблиц которые внутри gpkg</li>
 *   <li>Есть описание сущности "Проект"</li>
 *   <li>С каждым тиком цикла будет прибавляться информация о таблицах, слоях, стилях</li>
 * </ul>
 */

@Service("addDataOnGeoserver")
public class AddDataOnGeoserver implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(AddDataOnGeoserver.class);

    private final GeoServerSpeaker geoServerSpeaker;
    private final IMessageBusProducer messageBus;
    private final BaseHttpService baseHttpService;

    public AddDataOnGeoserver(GeoServerSpeaker geoServerSpeaker,
                              IMessageBusProducer messageBus,
                              BaseHttpService baseHttpService) {
        this.geoServerSpeaker = geoServerSpeaker;
        this.messageBus = messageBus;
        this.baseHttpService = baseHttpService;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        int currentIteration = (int) getVariable(delegateExecution, ITERATION_COUNTER_VAR_NAME, getClass().getName());
        if (currentIteration >= 4) {
            //просто идём дальше по цепочке
            delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, 0);

            return;
        }

        log.debug("Класс {} начал работу", AddDataOnGeoserver.class.getSimpleName());

        try {
            GpkgImportReport importReport = (GpkgImportReport) delegateExecution.getVariable(
                    EVENT_IMPORT_GPKG_REPORT_NAME);
            GpkgPayloadData payload = importReport.getPayload();
            List<GpkgImportedTable> prevTables = payload.getTables();
            GpkgTablesData currentTable = (GpkgTablesData) delegateExecution.getVariable(ENTITY_ID_VAR_NAME);

            GpkgImportedTable tableReport = prevTables
                    .stream()
                    .filter(table -> table.getCreatedTableIdentifier().equals(currentTable.getTableNewIdentifier()))
                    .findFirst()
                    .orElse(new GpkgImportedTable());

            ImportGpkgCopyDataBackwardEvent copyAnswer = (ImportGpkgCopyDataBackwardEvent)
                    delegateExecution.getVariable(FAIL_REASON);

            if (copyAnswer != null) {
                if (Objects.requireNonNull(copyAnswer.getStatus()) == TASK_DONE) {
                    tableReport.setStatus(COMPLETED);
                    List<String> prevMsg = tableReport.getMessages();
                    prevMsg.addAll(copyAnswer.getErrorReport().getMessages());
                    tableReport.setImportedObjects(copyAnswer.getErrorReport().getSuccessfulRecordCount());
                    tableReport.setFailedObjects(
                            (long) copyAnswer.getErrorReport().getFailedRecordCount());
                    tableReport.setMessages(prevMsg);
                } else {
                    tableReport.setStatus(ERROR);
                    List<String> prevMsg = tableReport.getMessages();
                    prevMsg.addAll(copyAnswer.getErrorReport().getMessages());
                    tableReport.setMessages(prevMsg);
                }
            }

            ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);

            ImportGpkgAckInfoBackwardEvent backward = (ImportGpkgAckInfoBackwardEvent)
                    delegateExecution.getVariable(EVENT_IMPORT_GPKG_BACKWARD_DATA_NAME);

            List<GpkgImportedStyles> styles = backward.getStyles();
            List<LayerProjection> lp = backward.getLayerProjections();

            for (GpkgImportedStyles style: styles) {
                List<String> prevMsg = style.getMessages();

                for (GpkgImportedSvg svg: style.getSvgs()) {
                    String modifiedSvgPath = geoServerSpeaker.addSvgOnGeoserver(event.getToken(),
                                                                                svg);
                    svg.setBody("hidden body: ********");
                    if (!svg.getTitle().equals(modifiedSvgPath)) {
                        svg.setMessages(List.of("Была создана новая SVG"));

                        String msg = "Запишем новую SVG '" + modifiedSvgPath + "' в стиль.";
                        log.debug(msg);

                        style.setBody(getNewStyleBody(style.getBody(), modifiedSvgPath, svg.getTitle()));
                        svg.setTitle(modifiedSvgPath);

                        prevMsg.add(msg);
                    }
                }

                String modifiedStyleName = geoServerSpeaker.addStyleOnGeoserver(event.getToken(),
                                                                                event.getDbName(),
                                                                                style);

                style.setStatus(COMPLETED);
                style.setBody("hidden body: ********");

                if (!style.getName().equals(modifiedStyleName)) {
                    log.debug("Запишем новый стиль и слой для публикации и в схему векторной таблицы");
                    prevMsg.add("На геосервере создан новый стиль с именем " + modifiedStyleName);

                    lp.stream()
                      .filter(layerProjection -> layerProjection.getStyleName().equals(style.getName()))
                      .forEach(layerProjection -> {
                          layerProjection.setStyleName(modifiedStyleName);
                      });

                    changeVectorTableSchemaStyleName(event.getToken(),
                                                     event.getTargetDatasetIdentifier(),
                                                     currentTable.getTableNewIdentifier(),
                                                     backward.getTable().getSchema(),
                                                     modifiedStyleName,
                                                     delegateExecution,
                                                     currentIteration);

                    style.setName(modifiedStyleName);

                    List<String> tablesPrevMsg = tableReport.getMessages();
                    tablesPrevMsg.add("Имя стиля в схеме будет изменено на: " + modifiedStyleName);
                    tableReport.setMessages(tablesPrevMsg);
                }

                style.setMessages(prevMsg);
            }

            // Потом прыгнуть на следующий шаг передав репорт (автоматом прыгнем)
            payload.setTables(prevTables);
            payload.setStyles(styles);
            importReport.setPayload(payload);

            String businessKey = (String) delegateExecution.getVariable(BUSINESS_KEY_VAR_NAME);
            PatchProcess newDetails = new PatchProcess(TASK_DONE, importReport);

            messageBus.produce(new UpdateProcessEvent(event.getProcessId(),
                                                      businessKey,
                                                      event.getDbName(),
                                                      newDetails));

            // Сбрасываем счетчик итераций при успешном выполнении
            delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, 0);
        } catch (BpmnError e) {
            // Пробрасываем BpmnError дальше (это наши ретраи)
            throw e;
        } catch (Exception e) {
            log.error("Неожиданная ошибка при обработке данных на геосервере: {}", e.getMessage(), e);
            delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, currentIteration + 1);

            throw new BpmnError("responseTimeOut");
        }
    }

    private void changeVectorTableSchemaStyleName(String token,
                                                  String dataset,
                                                  String createdTableIdentifier,
                                                  SchemaDto schema,
                                                  String modifiedStyleName,
                                                  DelegateExecution delegateExecution,
                                                  int currentIteration) throws IOException {
        schema.setStyleName(modifiedStyleName);
        URL dataServiceUrl = baseHttpService.getDataServiceUrl();
        URL exportUrl = new URL(dataServiceUrl,
                                "/datasets/" + dataset + "/tables/" + createdTableIdentifier + "/schema");

        RequestBody requestBody = RequestBody.create(
                MediaType.parse("application/json"),
                toJson(schema));

        Request request = new Request.Builder()
                .url(exportUrl)
                .put(requestBody)
                .addHeader("Authorization", "Bearer " + token)
                .build();

        try (Response response = BaseHttpService.httpClient.newCall(request).execute()) {
            if (response.isSuccessful()) {
                log.debug("Схема таблицы успешно обновлена для таблицы: {}", createdTableIdentifier);
            } else {
                int statusCode = response.code();
                log.warn("Data сервис вернул неуспешный статус: {} для обновления схемы таблицы: {}", statusCode,
                         createdTableIdentifier);

                // Только временные ошибки - повторяем
                if (statusCode == 503 || statusCode == 502 || statusCode == 504 || statusCode == 429) {
                    delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, currentIteration + 1);

                    throw new BpmnError("responseTimeOut");
                }
            }
        } catch (IOException e) {
            log.error("Ошибка ввода-вывода при обновлении схемы таблицы {}: {}", createdTableIdentifier, e.getMessage(),
                      e);
            delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, currentIteration + 1);

            throw new BpmnError("responseTimeOut");
        } catch (Exception e) {
            log.error("Ошибка при обновлении схемы таблицы {}: {}", createdTableIdentifier, e.getMessage(), e);
            delegateExecution.setVariable(ITERATION_COUNTER_VAR_NAME, currentIteration + 1);

            throw new BpmnError("responseTimeOut");
        }
    }

    private String getNewStyleBody(String styleBody, String newPath, String oldPath) {
        return styleBody.replace(oldPath, newPath);
    }
}
