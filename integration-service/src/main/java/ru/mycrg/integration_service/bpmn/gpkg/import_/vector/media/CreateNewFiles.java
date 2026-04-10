package ru.mycrg.integration_service.bpmn.gpkg.import_.vector.media;

import org.camunda.bpm.engine.delegate.BpmnError;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgFile;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessReport;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgCreateFilesEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.http_client.JsonConverter;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;
import ru.mycrg.messagebus_contract.IMessageBusProducer;
import tools.jackson.core.type.TypeReference;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import static ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessStatus.ACTIVE;
import static ru.mycrg.data_service_contract.enums.ProcessStatus.TASK_DONE;
import static ru.mycrg.integration_service.bpmn.CamundaVariables.asJava;
import static ru.mycrg.integration_service.bpmn.IJavaDelegateProperties.*;

@Service("createNewFile")
public class CreateNewFiles implements JavaDelegate {

    private static final Logger log = LoggerFactory.getLogger(CreateNewFiles.class);

    private final IMessageBusProducer messageBus;
    private final GpkgReportManager reportManager;

    public CreateNewFiles(IMessageBusProducer messageBus, GpkgReportManager reportManager) {
        this.messageBus = messageBus;
        this.reportManager = reportManager;
    }

    @Override
    public void execute(DelegateExecution delegateExecution) throws Exception {
        log.debug("Класс {} начал работу", CreateNewFiles.class.getSimpleName());

        Feature currentFeature = (Feature) delegateExecution.getVariable(IMPORT_GPKG_CURRENT_FEATURE_WITH_FILES);
        Map<String, Object> props = currentFeature.getProperties();

        List<UUID> fileIds = new ArrayList<>();
        List<GpkgFile> files = new ArrayList<>();
        try {
            for (Map.Entry<String, Object> prop: props.entrySet()) {
                Object propValue = prop.getValue();
                List<FileDescription> fileDescriptions = JsonConverter.convertValue(
                        propValue,
                        new TypeReference<>() {
                        }
                );

                String createdTableName = (String) delegateExecution.getVariable(IMPORT_GPKG_CREATED_TABLE_NAME);

                for (FileDescription fd: fileDescriptions) {
                    fileIds.add(fd.getId());
                    files.add(new GpkgFile(fd.getId(), createdTableName, ACTIVE, fd.getTitle()));
                }
            }
        } catch (Exception e) {
            log.error("Ошибка: {}", e.getMessage());

            throw new BpmnError("exceptionWithFileDescriptionParsing");
        }

        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(IMPORT_GPKG_EVENT);
        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);

        GpkgProcessReport importReport = (GpkgProcessReport) delegateExecution.getVariable(
                IMPORT_GPKG_EVENT_REPORT);
        reportManager.createFileReport(rabbitDto, importReport, files);

        delegateExecution.setVariable(IMPORT_GPKG_FILES_LIST, asJava(fileIds));

        String businessKey = delegateExecution.getProcessBusinessKey();
        messageBus.produce(new ImportGpkgCreateFilesEvent(businessKey,
                                                          event.getDbName(),
                                                          event.getFileId(),
                                                          event.getCreatorLogin(),
                                                          fileIds));
    }
}
