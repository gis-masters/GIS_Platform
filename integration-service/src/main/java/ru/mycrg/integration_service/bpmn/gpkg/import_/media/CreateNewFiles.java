package ru.mycrg.integration_service.bpmn.gpkg.import_.media;

import com.fasterxml.jackson.core.type.TypeReference;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgProcessReport;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgFile;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgPayloadData;
import ru.mycrg.common_contracts.generated.data_service.gpkg.import_.GpkgTablesData;
import ru.mycrg.data_service_contract.dto.FileDescription;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgCreateFilesEvent;
import ru.mycrg.data_service_contract.queue.request.gpkg.ImportGpkgEvent;
import ru.mycrg.geo_json.Feature;
import ru.mycrg.http_client.JsonConverter;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgReportManager;
import ru.mycrg.integration_service.bpmn.gpkg.report.GpkgProcessContext;
import ru.mycrg.messagebus_contract.IMessageBusProducer;

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
        GpkgTablesData currentTable = (GpkgTablesData) delegateExecution.getVariable(ENTITY_ID_VAR_NAME);
        String table = currentTable.getTableNewIdentifier();

        Feature currentFeature = (Feature) delegateExecution.getVariable(FEATURE_ID_VAR_NAME);

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

                for (FileDescription fd: fileDescriptions) {
                    fileIds.add(fd.getId());
                    files.add(new GpkgFile(fd.getId(), table, ACTIVE, fd.getTitle()));
                }
            }
        } catch (Exception e) {
            log.error("Ошибка: {}", e.getMessage());
        }

        String businessKey = (String) delegateExecution.getVariable(BUSINESS_KEY_VAR_NAME);
        ImportGpkgEvent event = (ImportGpkgEvent) delegateExecution.getVariable(EVENT_VAR_NAME);
        GpkgProcessContext rabbitDto = new GpkgProcessContext(event.getProcessId(),
                                                              event.getDbName(),
                                                              TASK_DONE);

        log.debug("Наполним файловый репорт");
        GpkgProcessReport importReport = (GpkgProcessReport) delegateExecution.getVariable(
                EVENT_IMPORT_GPKG_REPORT_NAME);
        reportManager.createFileReport(rabbitDto, importReport, files);

        delegateExecution.setVariable(FILES_LIST_VAR_NAME, asJava(fileIds));
        messageBus.produce(new ImportGpkgCreateFilesEvent(businessKey,
                                                          event.getDbName(),
                                                          event.getFileId(),
                                                          event.getCreatorLogin(),
                                                          fileIds));
    }
}
