package ru.mycrg.integration_service.bpmn.gpkg.import_.media;

import com.fasterxml.jackson.core.type.TypeReference;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.*;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.data_service_contract.dto.PatchProcess;
import ru.mycrg.data_service_contract.queue.request.UpdateProcessEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgCreateFilesBackwardEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.http_client.JsonConverter;
import ru.mycrg.http_client.ResponseModel;
import ru.mycrg.integration_service.service.DataServiceSpeaker;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

import java.util.*;

import static ru.mycrg.data_service_contract.enums.ProcessStatus.ERROR;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("updateFileRelation")
public class UpdateFileRelation implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(UpdateFileRelation.class);

    private final DataServiceSpeaker dataServiceSpeaker;
    private final IMessageBusProducer messageBus;

    public UpdateFileRelation(DataServiceSpeaker dataServiceSpeaker,
                              IMessageBusProducer messageBus) {
        this.dataServiceSpeaker = dataServiceSpeaker;
        this.messageBus = messageBus;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс {} начал работу", UpdateFileRelation.class.getSimpleName());
        String businessKey = (String) delegateExecution.getVariable(BUSINESS_KEY_VAR_NAME);
        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);

        ImportGpkgCreateFilesBackwardEvent fileCreateAnswer = (ImportGpkgCreateFilesBackwardEvent)
                delegateExecution.getVariable(EVENT_IMPORT_GPKG_BACKWARD_FILE_CREATE);

        Map<UUID, UUID> oldNewIds = fileCreateAnswer.getOldNewIds();
        GpkgImportReport importReport = (GpkgImportReport) delegateExecution.getVariable(
                EVENT_IMPORT_GPKG_REPORT_NAME);
        GpkgPayloadData payload = importReport.getPayload();
        List<GpkgImportedFile> filesReport = payload.getFiles();

        List<UUID> currentFileIds = (List<UUID>) delegateExecution.getVariable(FILES_LIST_VAR_NAME);

        if (fileCreateAnswer.getStatus() == ERROR) {
            log.warn("При создании файлов на data-service произошли критичные ошибки! " +
                             "Дальнейшая работа по добавления файла в фичу невозможна.");

            filesReport.stream()
                       .filter(fr -> currentFileIds.contains(fr.getOldId()))
                       .forEach((fr) -> {
                           fr.setStatus(GpkgProcessStatus.ERROR);
                           List<String> messages = new ArrayList<>();
                           messages.add("При сохранении файла на сервере произошла ошибка");
                           fr.setMessages(messages);
                       });

            payload.setFiles(filesReport);
            updateProcess(payload, event.getProcessId(), event.getDbName(), businessKey);

            return;
        }

        if (oldNewIds.isEmpty()) {
            log.warn("Статус успех, но файлов не создали.");

            filesReport.stream()
                       .filter(fr -> currentFileIds.contains(fr.getOldId()))
                       .forEach((fr) -> {
                           fr.setStatus(GpkgProcessStatus.ERROR);
                           List<String> messages = new ArrayList<>();
                           messages.add("Файл не был создан на сервере.");
                           fr.setMessages(messages);
                       });

            payload.setFiles(filesReport);
            updateProcess(payload, event.getProcessId(), event.getDbName(), businessKey);

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

                    filesReport.stream()
                               .filter(fr -> currentFileIds.contains(fr.getOldId()) && fr.getOldId().equals(oldId))
                               .forEach(fr -> fr.setNewId(newId));
                } else {
                    log.warn("Для файла с id {} не был создан свой новый файл", file.getId());

                    filesReport.stream()
                               .filter(fr -> currentFileIds.contains(fr.getOldId()) && fr.getOldId()
                                                                                         .equals(file.getId()))
                               .forEach(fr -> {
                                   List<String> messages = new ArrayList<>();
                                   messages.add("Новый файл не был создан на сервере");
                                   fr.setMessages(messages);
                                   fr.setStatus(GpkgProcessStatus.ERROR);
                               });
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
            filesReport.stream()
                       .filter(fr -> currentFileIds.contains(fr.getOldId()))
                       .forEach(fr -> fr.setStatus(GpkgProcessStatus.COMPLETED));
            log.debug("Все файлы успешно обновлены!");
        } else {
            filesReport.stream()
                       .filter(fr -> currentFileIds.contains(fr.getOldId()))
                       .forEach(fr -> {
                           fr.setStatus(GpkgProcessStatus.ERROR);
                           List<String> messages = new ArrayList<>();
                           messages.add("Новый файл был создан, но обновление фичи потерпело неудачу");
                           fr.setMessages(messages);
                       });
        }

        payload.setFiles(filesReport);
        updateProcess(payload, event.getProcessId(), event.getDbName(), businessKey);
    }

    private void updateProcess(GpkgPayloadData payload, Long processId, String dbName, String businessKey) {
        PatchProcess newDetails = new PatchProcess(TASK_DONE, payload);
        messageBus.produce(new UpdateProcessEvent(processId,
                                                  businessKey,
                                                  dbName,
                                                  newDetails));
    }
}
