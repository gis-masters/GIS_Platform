package ru.mycrg.integration_service.bpmn.gpkg.import_.media;

import org.camunda.bpm.engine.delegate.BpmnError;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTablesData;
import ru.mycrg.data_service_contract.dto.ResourceProjection;
import ru.mycrg.data_service_contract.dto.SimplePropertyDto;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgAckInfoBackwardEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.integration_service.service.DataServiceSpeaker;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static ru.mycrg.data_service_contract.enums.ValueType.FILE;
import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("fileCycleProcess")
public class FileCycleProcess implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(FileCycleProcess.class);

    private final DataServiceSpeaker dataServiceSpeaker;

    public FileCycleProcess(DataServiceSpeaker dataServiceSpeaker) {
        this.dataServiceSpeaker = dataServiceSpeaker;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс {} начал работу", FileCycleProcess.class.getSimpleName());
        int filesCyclesCount = (int) delegateExecution.getVariable(FILES_CYCLES_COUNT_VAR_NAME);
        int filesCyclesDone = (int) delegateExecution.getVariable(FILES_CYCLES_COUNT_DONE_VAR_NAME);

        ImportGpkgAckInfoBackwardEvent backward = (ImportGpkgAckInfoBackwardEvent)
                delegateExecution.getVariable(EVENT_IMPORT_GPKG_BACKWARD_DATA_NAME);

        GpkgTablesData currentTable = (GpkgTablesData) delegateExecution.getVariable(ENTITY_ID_VAR_NAME);
        ResourceProjection dataToTableCreate = backward.getTable();

        //Есть смысл работать только если в схеме вообще есть поля типа FILE
        List<String> fileProps = dataToTableCreate
                .getSchema()
                .getProperties().stream()
                .filter(property -> property.getValueTypeAsEnum() == FILE)
                .map(SimplePropertyDto::getName)
                .collect(Collectors.toList());

        //Мы в процессе первый раз и нам нужно получиться данные, чтобы стартовать
        if (filesCyclesDone == 0) {
            if (fileProps.isEmpty()) {
                log.debug("В схеме указанной таблицы нет файлов. Идём дальше");
                delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "allFilesWorkDone");

                return;
            }

            ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);
            //Построим такой CQL запрос и так спросим data-service чтобы он для текущей созданной и наполненной таблицы
            //вернул бы нам только записи если хотя бы одно поле файл
            String token = event.getToken();
            String dataset = event.getTargetDatasetIdentifier();
            String table = currentTable.getTableNewIdentifier();
            String filter = makeNotNullFilesPropsFilter(fileProps);

            //TODO: когда нибудь добавить ретраи
            List<Feature> features;
            try {
                log.debug("Вызываем dataServiceSpeaker.getAllFeaturesWithCustomFilter с filter: {}", filter);
                features = dataServiceSpeaker.getAllFeaturesWithCustomFilter(token,
                                                                             dataset,
                                                                             table,
                                                                             filter);
                log.debug("Получено features из dataServiceSpeaker: {}", features != null ? features.size() : "null");
            } catch (Exception e) {
                //Просто завершаем процесс импорта файлов для всего слоя, может потом нам повезёт
                log.error("Ошибка при получении features с фильтром: {}", e.getMessage(), e);
                delegateExecution.setVariable(FILES_CYCLES_COUNT_DONE_VAR_NAME, filesCyclesDone);
                delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "allFilesWorkDone");

                throw new BpmnError("responseTimeOut");
            }

            if (features == null || features.isEmpty()) {
                log.debug("В схеме таблицы есть поля файл, но они все они пустые. features={}", features);
                delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "allFilesWorkDone");
            } else {
                log.debug("Найдено {} фичей с файлами, начинаем обработку", features.size());
                delegateExecution.setVariable(FEATURES_FILES_LIST_VAR_NAME, asJava(features));
                delegateExecution.setVariable(FILES_CYCLES_COUNT_VAR_NAME, features.size());

                doStep(delegateExecution, filesCyclesDone, fileProps, features.get(filesCyclesDone));
            }

            return;
        }

        if (filesCyclesDone >= filesCyclesCount) {
            log.debug("Все фичи с файлами обработаны, выходим из цикла");
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "allFilesWorkDone");

            return;
        }

        List<Feature> features = (List<Feature>) delegateExecution.getVariable(FEATURES_FILES_LIST_VAR_NAME);

        doStep(delegateExecution, filesCyclesDone, fileProps, features.get(filesCyclesDone));
    }

    private void doStep(DelegateExecution delegateExecution,
                        int filesCyclesDone,
                        List<String> fileProps,
                        Feature feature) {
        Map<String, Object> currentProps = feature.getProperties();
        currentProps.keySet().retainAll(fileProps);
        feature.setProperties(currentProps);

        delegateExecution.setVariable(FEATURE_ID_VAR_NAME, asJava(feature));
        filesCyclesDone = filesCyclesDone + 1;
        delegateExecution.setVariable(FILES_CYCLES_COUNT_DONE_VAR_NAME, filesCyclesDone);
        delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, "haveOneMoreFile");
    }

    private String makeNotNullFilesPropsFilter(List<String> fileProps) {
        if (fileProps.isEmpty()) {
            return "";
        }

        String joined = fileProps.stream()
                                 .map(p -> String.format("(%s IS NOT NULL)", p))
                                 .collect(java.util.stream.Collectors.joining(" OR "));

        return "(" + joined + ")";
    }
}
