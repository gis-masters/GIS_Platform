package ru.mycrg.integration_service.bpmn.gpkg.import_.vector.media;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service_contract.dto.SchemaDto;
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
import static ru.mycrg.integration_service.bpmn.enums.GpkgImportProcessPermittedStatus.ALL_FILES_WORK_DONE;
import static ru.mycrg.integration_service.bpmn.enums.GpkgImportProcessPermittedStatus.HAVE_ONE_MORE_FILE;

@Service("startCycleProcessFile")
public class StartCycleProcessFile implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(StartCycleProcessFile.class);

    private final DataServiceSpeaker dataServiceSpeaker;

    public StartCycleProcessFile(DataServiceSpeaker dataServiceSpeaker) {
        this.dataServiceSpeaker = dataServiceSpeaker;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс {} начал работу", StartCycleProcessFile.class.getSimpleName());
        int filesCyclesCount = (int) delegateExecution.getVariable(IMPORT_GPKG_CYCLES_COUNT_FILES);
        int filesCyclesDone = (int) delegateExecution.getVariable(IMPORT_GPKG_CYCLES_COUNT_FILES_DONE);

        ImportGpkgAckInfoBackwardEvent backward = (ImportGpkgAckInfoBackwardEvent)
                delegateExecution.getVariable(IMPORT_GPKG_BACKWARD_EXTRACTED_DATA);

        SchemaDto schemaDtoOfCreatedTable = backward.getTable().getSchema();

        //Есть смысл работать только если в схеме вообще есть поля типа FILE
        List<String> fileProps = schemaDtoOfCreatedTable
                .getProperties()
                .stream()
                .filter(property -> property.getValueTypeAsEnum() == FILE)
                .map(SimplePropertyDto::getName)
                .collect(Collectors.toList());

        //Мы в процессе первый раз и нам нужно получиться данные, чтобы стартовать
        if (filesCyclesDone == 0) {
            if (fileProps.isEmpty()) {
                log.debug("В схеме указанной таблицы нет файлов. Идём дальше.");
                delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, ALL_FILES_WORK_DONE.getValue());

                return;
            }

            ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(IMPORT_GPKG_EVENT);
            /*
            Построим такой CQL запрос и так спросим data-service чтобы он для текущей созданной и наполненной таблицы
            вернул бы нам только записи если хотя бы одно поле файл есть и заполнено.
             */
            String token = event.getToken();
            String dataset = event.getTargetDatasetIdentifier();
            String createdTableName = (String) delegateExecution.getVariable(IMPORT_GPKG_CREATED_TABLE_NAME);
            String filter = makeNotNullFilesPropsFilter(fileProps);

            //TODO: когда нибудь добавить ретраи. В камунда процессе есть ловушка на "responseTimeOut"
            List<Feature> features;
            try {
                log.debug("Вызываем dataServiceSpeaker.getAllFeaturesWithCustomFilter с filter: {}", filter);
                features = dataServiceSpeaker.getAllFeaturesWithCustomFilter(token,
                                                                             dataset,
                                                                             createdTableName,
                                                                             filter);
                log.debug("Получено features из dataServiceSpeaker: {}", features != null ? features.size() : "null");
            } catch (Exception e) {
                //Просто завершаем процесс импорта файлов для всего слоя, может потом нам повезёт
                log.error("Ошибка при получении features с фильтром: {}", e.getMessage(), e);
                delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, ALL_FILES_WORK_DONE.getValue());

                return;
//                throw new BpmnError("responseTimeOut");
            }

            if (features == null || features.isEmpty()) {
                log.debug("В схеме таблицы есть поля файл, но они все они пустые. features={}", features);
                delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, ALL_FILES_WORK_DONE.getValue());
            } else {
                log.debug("Найдено {} фичей с файлами, начинаем обработку", features.size());
                delegateExecution.setVariable(IMPORT_GPKG_FEATURES_WITH_FILES_LIST, asJava(features));
                delegateExecution.setVariable(IMPORT_GPKG_CYCLES_COUNT_FILES, features.size());

                doStep(delegateExecution, filesCyclesDone, fileProps, features.get(filesCyclesDone));
            }

            return;
        }

        if (filesCyclesDone >= filesCyclesCount) {
            log.debug("Все фичи с файлами обработаны, выходим из цикла");
            delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, ALL_FILES_WORK_DONE.getValue());

            return;
        }

        List<Feature> features = (List<Feature>) delegateExecution.getVariable(IMPORT_GPKG_FEATURES_WITH_FILES_LIST);

        doStep(delegateExecution, filesCyclesDone, fileProps, features.get(filesCyclesDone));
    }

    private void doStep(DelegateExecution delegateExecution,
                        int filesCyclesDone,
                        List<String> fileProps,
                        Feature feature) {
        Map<String, Object> currentProps = feature.getProperties();
        currentProps.keySet().retainAll(fileProps);
        feature.setProperties(currentProps);

        delegateExecution.setVariable(IMPORT_GPKG_CURRENT_FEATURE_WITH_FILES, asJava(feature));
        filesCyclesDone = filesCyclesDone + 1;
        delegateExecution.setVariable(IMPORT_GPKG_CYCLES_COUNT_FILES_DONE, filesCyclesDone);
        delegateExecution.setVariable(CHECK_STATUS_VAR_NAME, HAVE_ONE_MORE_FILE.getValue());
    }

    private String makeNotNullFilesPropsFilter(List<String> fileProps) {
        if (fileProps.isEmpty()) {
            return "";
        }

        String joined = fileProps.stream()
                                 .map(p -> String.format("(%s IS NOT NULL)", p))
                                 .collect(Collectors.joining(" OR "));

        return "(" + joined + ")";
    }
}
