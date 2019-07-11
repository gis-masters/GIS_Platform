package ru.mycrg.gis.service.import_;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.BaseMqProcessResponse;
import ru.mycrg.common.ResourceProjection;
import ru.mycrg.common.enums.ProcessType;
import ru.mycrg.common.import_.ImportFeature;
import ru.mycrg.common.import_.ImportMqRequest;
import ru.mycrg.gis.dto.ProjectModel;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.service.ProcessService;
import ru.mycrg.gis.service.Processable;
import ru.mycrg.gis.service.ProjectService;
import ru.mycrg.gis.service.WsNotificationService;

import java.security.Principal;
import java.util.Optional;

@Service
public class ImportService implements Processable {

    private static Logger log = LoggerFactory.getLogger(ImportService.class);

    private final MqSender mqSender;
    private final ProjectService projectService;
    private final ProcessService processService;
    private final WsNotificationService wsNotificationService;

    public ImportService(MqSender mqSender,
                         ProjectService projectService,
                         ProcessService processService,
                         WsNotificationService wsNotificationService) {
        this.mqSender = mqSender;
        this.projectService = projectService;
        this.processService = processService;
        this.wsNotificationService = wsNotificationService;
    }

    public Process initProcess(Long orgId, Long projectId, WorkImport workImport, Principal principal) {
        ProjectModel projectModel = projectService.getProject(orgId, projectId, principal);

        Process process = processService.create(
                principal.getName(),
                String.format("Импорт в проект: %s", projectModel.getInternalName()),
                ProcessType.IMPORT);

        ImportMqRequest importMqRequest = new ImportMqRequest(process.getId(), ProcessType.IMPORT);
        workImport.getImportTasks().forEach(importTask -> {
            ImportFeature importFeature = new ImportFeature(
                    new ResourceProjection(
                            projectModel.getDatabaseName(),
                            "public", // Источником рабочего импорта является хранилище "scratch - public схема в БД"
                            importTask.getLayerName()),
                    new ResourceProjection(
                            projectModel.getDatabaseName(),
                            workImport.getTargetSchema(),
                            importTask.getWorkTableName()),
                    importTask.getMapping());

            importMqRequest.addImportFeature(importFeature);
        });

        mqSender.initImport(importMqRequest);

        return process;
    }

    @Override
    public void handleMqResponse(BaseMqProcessResponse response) {
        if (response.getId() == null) {
            log.warn("Return invalid response");
        }

        Optional<Process> processById = processService.getProcessById(response.getId());
        if (processById.isPresent()) {
            Process process = processById.get();

//            wsNotificationService.send(new WsMessageDto<>(response.getType(), response), process.getRequest().getWsUiId());

            processService.complete(process);
        } else {
            log.warn("Not found import process by id: {}", response.getId());
        }
    }
}
