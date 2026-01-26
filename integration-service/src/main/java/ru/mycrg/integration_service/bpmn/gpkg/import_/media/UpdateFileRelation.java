package ru.mycrg.integration_service.bpmn.gpkg.import_.media;

import com.fasterxml.jackson.core.type.TypeReference;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgImportReport;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgPayloadData;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTablesData;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgCreateFilesBackwardEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.http_client.JsonConverter;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.integration_service.bpmn.gpkg.GpkgImportReportManager;
import ru.mycrg.integration_service.bpmn.gpkg.ReportSendConfigDto;
import ru.mycrg.integration_service.service.DataServiceSpeaker;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("updateFileRelation")
public class UpdateFileRelation implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(UpdateFileRelation.class);

    private final DataServiceSpeaker dataServiceSpeaker;
    private final GpkgImportReportManager reportManager;

    public UpdateFileRelation(DataServiceSpeaker dataServiceSpeaker,
                              GpkgImportReportManager reportManager) {
        this.dataServiceSpeaker = dataServiceSpeaker;
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс {} начал работу", UpdateFileRelation.class.getSimpleName());
        String businessKey = (String) delegateExecution.getVariable(BUSINESS_KEY_VAR_NAME);
        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);
        ReportSendConfigDto rabbitDto = new ReportSendConfigDto(event.getProcessId(),
                                                                event.getDbName(),
                                                                businessKey,
                                                                TASK_DONE);

        ImportGpkgCreateFilesBackwardEvent fileCreateAnswer = (ImportGpkgCreateFilesBackwardEvent)
                delegateExecution.getVariable(EVENT_IMPORT_GPKG_BACKWARD_FILE_CREATE);

        Map<UUID, UUID> oldNewIds = fileCreateAnswer.getOldNewIds();
        GpkgImportReport importReport = (GpkgImportReport) delegateExecution.getVariable(
                EVENT_IMPORT_GPKG_REPORT_NAME);
        GpkgPayloadData payload = importReport.getPayload();

        List<UUID> currentFileIds = (List<UUID>) delegateExecution.getVariable(FILES_LIST_VAR_NAME);

        if (fileCreateAnswer.getStatus() == ERROR) {
            log.warn("При создании файлов на data-service произошли критичные ошибки! " +
                             "Дальнейшая работа по добавления файла в фичу невозможна.");

            reportManager.updateFileReportWithError(rabbitDto, payload, currentFileIds);

            return;
        }

        if (oldNewIds.isEmpty()) {
            log.warn("Статус успех, но файлов не создали.");

            reportManager.updateFileReportWithError(rabbitDto, payload, currentFileIds);

            return;
        }

        //Если нам успешно удалось обработать файлы значит нужно сформировать запрос на обновление фичи
        Feature currentFeature = (Feature) delegateExecution.getVariable(FEATURE_ID_VAR_NAME);

        Map<String, Object> currentFeatureFileProps = currentFeature.getProperties();

        Map<String, List<FileDescription>> fileDataProps = new HashMap<>();

        //Конвертируем все properties в правильные типы
        for (Map.Entry<String, Object> entry: currentFeatureFileProps.entrySet()) {
            Object propValue = entry.getValue();
            List<FileDescription> fileDescriptions = JsonConverter.convertValue(
                    propValue,
                    new TypeReference<>() {
                    }
            );
            fileDataProps.put(entry.getKey(), fileDescriptions);
        }

        //Перезапишем все собранные файлы новыми ID и по пути соберём репорт
        for (Map.Entry<String, List<FileDescription>> entry: fileDataProps.entrySet()) {
            for (FileDescription file: entry.getValue()) {
                if (oldNewIds.containsKey(file.getId())) {
                    UUID oldId = file.getId();
                    UUID newId = oldNewIds.get(oldId);
                    file.setId(newId);

                    reportManager.updateFileIdInReport(rabbitDto, payload, currentFileIds, oldId, newId);
                } else {
                    log.warn("Для файла с id {} не был создан свой новый файл", file.getId());

                    reportManager.updateFileReportWithErrorCustomMsg(rabbitDto,
                                                                     payload,
                                                                     currentFileIds,
                                                                     "Новый файл не был создан на сервере!");
                }
            }
        }

        String dataset = event.getTargetDatasetIdentifier();
        GpkgTablesData currentTable = (GpkgTablesData) delegateExecution.getVariable(ENTITY_ID_VAR_NAME);
        String table = currentTable.getTableNewIdentifier();

        //TODO: когда нибудь добавить ретраи
        ResponseModel<Object> response = dataServiceSpeaker.patchCurrentRecord(event.getToken(),
                                                                               dataset,
                                                                               table,
                                                                               fileDataProps,
                                                                               currentFeature.getId());

        if (response.isSuccessful()) {
            reportManager.updateFileReportWithCompleted(rabbitDto, payload, currentFileIds);

            log.debug("Все файлы успешно обновлены!");
        } else {
            reportManager
                    .updateFileReportWithErrorCustomMsg(rabbitDto, payload,
                                                        currentFileIds,
                                                        "Новый файл был создан, но обновление фичи потерпело неудачу!");
        }
    }
}
