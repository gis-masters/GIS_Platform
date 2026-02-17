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
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgStyle;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgSvg;
import ru.mycrg.data_service_contract.dto.SchemaDto;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgAckInfoBackwardEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgCopyDataBackwardEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.gis_service_contract.dto.LayerProjection;
import ru.mycrg.integration_service.bpmn.BaseHttpService;
import ru.mycrg.integration_service.bpmn.gpkg.GeoServerSpeaker;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;

import java.io.IOException;
import java.net.URL;
import java.util.List;
import java.util.Objects;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.COMPLETED;
import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.ERROR;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.http_client.JsonConverter.toJson;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("addDataOnGeoserver")
public class AddDataOnGeoserver implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(AddDataOnGeoserver.class);

    private final GeoServerSpeaker geoServerSpeaker;
    private final BaseHttpService baseHttpService;
    private final GpkgReportManager reportManager;

    public AddDataOnGeoserver(GeoServerSpeaker geoServerSpeaker,
                              BaseHttpService baseHttpService,
                              GpkgReportManager reportManager) {
        this.geoServerSpeaker = geoServerSpeaker;
        this.baseHttpService = baseHttpService;
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс {} начал работу", AddDataOnGeoserver.class.getSimpleName());
        int currentIteration = (int) delegateExecution.getVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS);
        if (currentIteration >= 4) {
            //просто идём дальше по цепочке
            delegateExecution.setVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS, 0);

            return;
        }

        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(IMPORT_GPKG_EVENT);
        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);

        try {
            GpkgProcessReport importReport = (GpkgProcessReport) delegateExecution
                    .getVariable(IMPORT_GPKG_EVENT_REPORT);

            GpkgContentsFeatures currentTable = (GpkgContentsFeatures) delegateExecution
                    .getVariable(IMPORT_GPKG_CURRENT_VECTOR_TABLE);

            ImportGpkgCopyDataBackwardEvent answerAfterCopy = (ImportGpkgCopyDataBackwardEvent) delegateExecution
                    .getVariable(IMPORT_GPKG_FAIL_REASON);

            log.debug("answerAfterCopy: {}", answerAfterCopy);

            if (answerAfterCopy != null) {
                if (Objects.requireNonNull(answerAfterCopy.getStatus()) == TASK_DONE) {

                    reportManager.updateTableRepByIdentifier(rabbitDto,
                                                             importReport,
                                                             COMPLETED,
                                                             answerAfterCopy,
                                                             currentTable.getTableName());
                } else {
                    reportManager.updateTableRepByIdentifier(rabbitDto,
                                                             importReport,
                                                             ERROR,
                                                             answerAfterCopy.getErrorReport().getMessages(),
                                                             currentTable.getTableName());
                }
            }

            ImportGpkgAckInfoBackwardEvent backward = (ImportGpkgAckInfoBackwardEvent) delegateExecution
                    .getVariable(IMPORT_GPKG_BACKWARD_EXTRACTED_DATA);

            List<GpkgStyle> styles = backward.getStyles();
            List<LayerProjection> lp = backward.getLayerProjections();
            reportManager.createStylesReport(rabbitDto, importReport, styles);

            for (GpkgStyle style: styles) {
                for (GpkgSvg svg: style.getSvgs()) {
                    processSingleSvg(svg, style, event.getToken(), importReport, rabbitDto);
                }

                String modifiedStyleName = geoServerSpeaker.addStyleOnGeoserverRecursive(event.getToken(),
                                                                                         event.getDbName(),
                                                                                         style.getName(),
                                                                                         style.getBody());

                reportManager.updateStyleReportByIdentifier(rabbitDto, importReport,
                                                            COMPLETED, "hidden body: ********", style.getTitle());

                if (!style.getName().equals(modifiedStyleName)) {
                    handleStyleNameChange(style, modifiedStyleName, lp, event, currentTable.getTableName(),
                                          backward, delegateExecution, currentIteration, importReport, rabbitDto);
                }
            }

            // Сбрасываем счетчик итераций при успешном выполнении
            delegateExecution.setVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS, 0);
        } catch (BpmnError e) {
            // Пробрасываем BpmnError дальше (это наши ретраи)
            throw e;
        } catch (Exception e) {
            log.error("Неожиданная ошибка при обработке данных на геосервере: {}", e.getMessage(), e);
            delegateExecution.setVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS, currentIteration + 1);

            throw new BpmnError("responseTimeOut");
        }
    }

    private void handleStyleNameChange(GpkgStyle style,
                                       String modifiedStyleName,
                                       List<LayerProjection> lp,
                                       ImportGpkgEvent event,
                                       String currentTableOldName,
                                       ImportGpkgAckInfoBackwardEvent backward,
                                       DelegateExecution delegateExecution,
                                       int currentIteration,
                                       GpkgProcessReport processReport,
                                       GpkgProcessContext rabbitDto) throws Exception {
        log.debug("Запишем новый стиль и слой для публикации и в схему векторной таблицы");

        reportManager.updateStyleReportByIdentifier(rabbitDto,
                                                    processReport,
                                                    "На геосервере создан новый стиль с именем " + modifiedStyleName,
                                                    style.getTitle());

        lp.stream()
          .filter(layerProjection -> layerProjection.getStyleName().equals(style.getName()))
          .forEach(layerProjection -> layerProjection.setStyleName(modifiedStyleName));

        String createdTableName = (String) delegateExecution.getVariable(IMPORT_GPKG_CREATED_TABLE_NAME);
        changeVectorTableSchemaStyleName(event.getToken(),
                                         event.getTargetDatasetIdentifier(),
                                         createdTableName,
                                         backward.getTable().getSchema(),
                                         modifiedStyleName,
                                         delegateExecution,
                                         currentIteration);

        style.setName(modifiedStyleName);

        String newMsg = "Имя стиля в схеме будет изменено на: " + modifiedStyleName;
        reportManager.updateTableRepByIdentifier(rabbitDto, processReport, newMsg, currentTableOldName);
    }

    private void processSingleSvg(GpkgSvg svg,
                                  GpkgStyle style,
                                  String token,
                                  GpkgProcessReport importReport,
                                  GpkgProcessContext rabbitDto) throws Exception {
        String modifiedSvgPath = geoServerSpeaker.addSvgOnGeoserverRecursive(token, svg.getTitle(), svg.getBody());

        reportManager.hideSvgBody(importReport, style.getTitle(), svg.getTitle());

        if (!svg.getTitle().equals(modifiedSvgPath)) {
            handleSvgNameChange(svg, style, modifiedSvgPath, importReport, rabbitDto);
        }

        reportManager.updateSvgReport(importReport, COMPLETED, style.getTitle(), svg.getTitle());
    }

    private void handleSvgNameChange(GpkgSvg svg,
                                     GpkgStyle style,
                                     String modifiedSvgPath,
                                     GpkgProcessReport importReport,
                                     GpkgProcessContext rabbitDto) {
        String originSvgPath = svg.getTitle();

        reportManager.updateSvgTitle(rabbitDto, importReport, style.getTitle(), modifiedSvgPath, svg.getTitle());

        String msg = "Запишем новую SVG '" + modifiedSvgPath + "' в стиль.";
        log.debug(msg);

        style.setBody(style.getBody().replace(originSvgPath, modifiedSvgPath));
        svg.setTitle(modifiedSvgPath);

        reportManager.updateStyleReportByIdentifier(rabbitDto, importReport, msg, style.getTitle());
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
                    delegateExecution.setVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS, currentIteration + 1);

                    throw new BpmnError("responseTimeOut");
                }
            }
        } catch (IOException e) {
            log.error("Ошибка ввода-вывода при обновлении схемы таблицы {}: {}", createdTableIdentifier, e.getMessage(),
                      e);
            delegateExecution.setVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS, currentIteration + 1);

            throw new BpmnError("responseTimeOut");
        } catch (Exception e) {
            log.error("Ошибка при обновлении схемы таблицы {}: {}", createdTableIdentifier, e.getMessage(), e);
            delegateExecution.setVariable(IMPORT_GPKG_COUNT_HTTP_ERRORS, currentIteration + 1);

            throw new BpmnError("responseTimeOut");
        }
    }
}
