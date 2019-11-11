package ru.mycrg.gis.service.import_;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessRequest;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.FeatureDescriptionDto;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.enums.ProcessType;
import ru.mycrg.common.import_.ImportMqResponse;
import ru.mycrg.common.import_.ImportMqTask;
import ru.mycrg.gis.dto.ProjectModel;
import ru.mycrg.gis.dto.TaskModel;
import ru.mycrg.gis.dto.WsMessageDto;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.repository.ProcessRepository;
import ru.mycrg.gis.service.BaseProcessService;
import ru.mycrg.gis.service.CrgAuthHelper;
import ru.mycrg.gis.service.ProjectService;
import ru.mycrg.gis.service.WsNotificationService;
import ru.mycrg.gis.service.dataSchema.DataSchemaService;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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

    public Process initProcess(Long orgId, Long projectId, WorkImport workImport, Principal principal) {
        ProjectModel projectModel = projectService.getProject(orgId, projectId);

        Process process = create(principal.getName(),
                String.format("Импорт %d слоя(ёв) в проект: %s",
                        workImport.getImportTasks().size(), projectModel.getInternalName()),
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

            ImportMqTask importMqTask = new ImportMqTask(featureDescription,
                    new ResourceProjection(projectModel.getDatabaseName(), "public", uiTask.getLayerName()),
                    new ResourceProjection(
                            projectModel.getDatabaseName(),
                            projectModel.getWorkspaceName(),
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
