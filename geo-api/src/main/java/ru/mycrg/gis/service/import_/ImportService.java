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
import ru.mycrg.gis.dto.WsMessageDto;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.repository.ProcessRepository;
import ru.mycrg.gis.service.BaseProcessService;
import ru.mycrg.gis.service.ProjectService;
import ru.mycrg.gis.service.WsNotificationService;

import java.security.Principal;
import java.util.Optional;

@Service
public class ImportService extends BaseProcessService {

    private static Logger log = LoggerFactory.getLogger(ImportService.class);

    private final MqSender mqSender;
    private final ProjectService projectService;
    private final WsNotificationService wsNotificationService;

    public ImportService(MqSender mqSender,
                         ProjectService projectService,
                         ProcessRepository processRepository,
                         WsNotificationService wsNotificationService) {
        super(processRepository);

        this.mqSender = mqSender;
        this.projectService = projectService;
        this.wsNotificationService = wsNotificationService;
    }

    public Process initProcess(Long orgId, Long projectId, WorkImport workImport, Principal principal) {
        ProjectModel projectModel = projectService.getProject(orgId, projectId, principal);

        Process process = create(principal.getName(),
                String.format("Импорт %d слоёв в проект: %s",
                        workImport.getImportTasks().size(), projectModel.getInternalName()),
                ProcessType.IMPORT, workImport.getWsUiId());

        ImportMqRequest importMqRequest = new ImportMqRequest(process.getId(), ProcessType.IMPORT);
        workImport.getImportTasks().forEach(importTask -> {
            ImportFeature importFeature = new ImportFeature(
                    new ResourceProjection(
                            projectModel.getDatabaseName(),
                            "public", // Источником рабочего импорта является хранилище "scratch - public схема в БД"
                            importTask.getLayerName()),
                    new ResourceProjection(
                            projectModel.getDatabaseName(),
                            projectModel.getWorkspaceName(),
                            importTask.getWorkTableName()),
                    importTask.getMapping());

            importMqRequest.addImportFeature(importFeature);
        });

        mqSender.initImport(importMqRequest);

        return process;
    }

    @Override
    public void handleMqResponse(BaseMqProcessResponse mqResponse) {
        if (mqResponse.getId() == null) {
            log.warn("Return invalid mqResponse");
        }

        Process process = getProcessById(mqResponse.getId());
        handleProcessResponse(process, mqResponse);

        String wsUiId = process.getExtra().toString();
        wsNotificationService.send(new WsMessageDto<>(mqResponse.getType(), mqResponse), wsUiId);
    }
}
