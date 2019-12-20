package ru.mycrg.gis.service.import_;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.gis.dto.TaskModel;
import ru.mycrg.gis.dto.WsMessageDto;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.entity.Project;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.repository.ProcessRepository;
import ru.mycrg.gis.service.BaseProcessService;
import ru.mycrg.gis.service.CrgAuthHelper;
import ru.mycrg.gis.service.ProjectService;
import ru.mycrg.gis.service.WsNotificationService;
import ru.mycrg.gis.service.dataSchema.DataSchemaService;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;
import ru.mycrg.mq_queue_contract.FeatureDescriptionDto;
import ru.mycrg.mq_queue_contract.ResourceProjection;
import ru.mycrg.mq_queue_contract.enums.ProcessType;
import ru.mycrg.mq_queue_contract.import_.ImportMqResponse;
import ru.mycrg.mq_queue_contract.import_.ImportMqTask;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static ru.mycrg.gis.security.CrgClaimsParser.getOrganizationId;
import static ru.mycrg.mq_queue_contract.CrgConstants.DEFAULT_DB_NAME;

@Service
public class ImportService extends BaseProcessService {

    private static Logger log = LoggerFactory.getLogger(ImportService.class);

    private final DataSchemaService schemaService;
    private final MqSender mqSender;
    private final ProjectService projectService;
    private final WsNotificationService wsNotificationService;

    public ImportService(MqSender mqSender,
                         DataSchemaService schemaService,
                         ProjectService projectService,
                         ProcessRepository processRepository,
                         WsNotificationService wsNotificationService) {
        super(processRepository);

        this.mqSender = mqSender;
        this.schemaService = schemaService;
        this.projectService = projectService;
        this.wsNotificationService = wsNotificationService;
    }

    public Process initProcess(Long projectId, WorkImport workImport, Principal principal) {
        long orgId = getOrganizationId(principal);

        Project project = projectService.getProject(orgId, projectId);

        Process process = create(principal.getName(),
                String.format("Импорт %d слоя(ёв) в проект: %s",
                        workImport.getImportTasks().size(), project.getInternalName()),
                ProcessType.IMPORT, workImport.getWsUiId());

        List<ImportMqTask> importMqRequest = new ArrayList<>();
        workImport.getImportTasks().forEach(uiTask -> {
            String workTableName = uiTask.getWorkTableName().toLowerCase();

            FeatureDescriptionDto featureDescription = new FeatureDescriptionDto();
            Optional<FeatureDescriptionDto> oDescription = schemaService.getDescriptionByName(uiTask.getSchemaName());
            if (oDescription.isPresent()) {
                featureDescription = oDescription.get();

                log.debug("Import by schema: {}", featureDescription.getName());
            } else {
                featureDescription.setName(workTableName);
                featureDescription.setTableName(workTableName);

                log.debug("Import AsIs, workTableName: {}", workTableName);
            }

            String dbName = DEFAULT_DB_NAME + orgId;
            ImportMqTask importMqTask = new ImportMqTask(featureDescription,
                    new ResourceProjection(dbName, "public", uiTask.getLayerName()),
                    new ResourceProjection(
                            dbName,
                            project.getGeoserverName(),
                            featureDescription.getTableName()),
                    uiTask.getPairs(),
                    uiTask.getSrs(),
                    CrgAuthHelper.getToken(principal)
            );

            importMqRequest.add(importMqTask);
        });

        mqSender.send(new BaseMqProcessRequest(process.getId(), ProcessType.IMPORT, importMqRequest));

        return process;
    }

    @Override
    public void handleMqResponse(BaseMqProcessResponse mqResponse) {
        if (mqResponse.getId() == null) {
            log.warn("Return invalid mqResponse");
        }

        Process process = getProcessById(mqResponse.getId());
        switch (mqResponse.getStatus()) {
            case TASK_ERROR:
            case TASK_DONE: addSubStep(process, mqResponse);        break;
            case ERROR:     error(process, mqResponse.getError());  break;
            case DONE:      complete(process, null);           break;
            default:
                log.warn("Not supported process status. {}", process);
        }

        JsonNode extraInfo = process.getExtra();
        String wsUiId = "null";
        if (extraInfo != null) {
            wsUiId = extraInfo.asText();
        }

        wsNotificationService.send(new WsMessageDto<>(mqResponse.getType(), mqResponse), wsUiId);
    }

    private void addSubStep(Process process, BaseMqProcessResponse mqResponse) {
        try {
            TaskModel subProcess = new TaskModel();
            if (!mqResponse.getPayload().equals("")) {
                ImportMqResponse rPayload = mapper.convertValue(mqResponse.getPayload(), ImportMqResponse.class);
                subProcess = new TaskModel(rPayload.getTargetLayer(), mqResponse.getStatus(), mqResponse.getError());
            } else if (mqResponse.getDescription() != null) {
                subProcess = new TaskModel(mqResponse.getStatus(), mqResponse.getError());
            } else {
                log.warn("Task for processId: {} not have any description/payload?", process.getId());
            }

            addTask(process, subProcess);
        } catch (Exception e) {
            log.error("Failed add subStep to process / Error: {}", e.getMessage());
        }
    }

}
