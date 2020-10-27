package ru.mycrg.gis.service.import_;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.gis.dto.TaskModel;
import ru.mycrg.gis.dto.WsMessageDto;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.exceptions.FailedException;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.repository.ProcessRepository;
import ru.mycrg.gis.service.BaseProcessService;
import ru.mycrg.gis.service.SchemaService;
import ru.mycrg.gis.service.WsNotificationService;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;
import ru.mycrg.mq_queue_contract.ResourceProjection;
import ru.mycrg.mq_queue_contract.SchemaDto;
import ru.mycrg.mq_queue_contract.enums.ProcessType;
import ru.mycrg.mq_queue_contract.import_.ImportMqResponse;
import ru.mycrg.mq_queue_contract.import_.ImportMqTask;
import ru.mycrg.oauth_client.OAuthClient;

import java.net.URL;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static ru.mycrg.gis.security.CrgClaimsParser.getOrganizationId;
import static ru.mycrg.mq_queue_contract.CrgConstants.DEFAULT_DB_NAME;

@Service
public class ImportService extends BaseProcessService {

    private static final Logger log = LoggerFactory.getLogger(ImportService.class);

    private final Environment environment;
    private final SchemaService schemaService;
    private final MqSender mqSender;
    private final WsNotificationService wsNotificationService;

    public ImportService(MqSender mqSender,
                         Environment environment,
                         SchemaService schemaService,
                         ProcessRepository processRepository,
                         WsNotificationService wsNotificationService) {
        super(processRepository);

        this.mqSender = mqSender;
        this.environment = environment;
        this.schemaService = schemaService;
        this.wsNotificationService = wsNotificationService;
    }

    public Process initProcess(String projectName, WorkImport workImport, Principal principal) {
        long orgId = getOrganizationId(principal);

        Process process = create(principal.getName(),
                String.format("Импорт %d слоя(ёв) в проект: %s", workImport.getImportTasks().size(), projectName),
                ProcessType.IMPORT, workImport.getWsUiId());

        List<ImportMqTask> importMqRequest = new ArrayList<>();
        workImport.getImportTasks().forEach(uiTask -> {
            String workTableName = uiTask.getWorkTableName().toLowerCase();

            SchemaDto featureDescription = new SchemaDto();
            Optional<SchemaDto> oDescription = schemaService.getSchemaByLayerName(uiTask.getSchemaName());
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
                            projectName,
                            featureDescription.getTableName()),
                    uiTask.getPairs(),
                    uiTask.getSrs(),
                    getRootAccessToken()
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

    private String getRootAccessToken() {
        try {
            String authServiceUrl = environment.getRequiredProperty("crg-options.auth-service-url");
            String clientId = environment.getRequiredProperty("crg-options.client_id");
            String clientSecret = environment.getRequiredProperty("crg-options.client_secret");
            String rootUserName = environment.getRequiredProperty("crg-options.root-user-name");
            String rootUserPass = environment.getRequiredProperty("crg-options.root-user-password");

            return OAuthClient.builder()
                              .url(new URL(authServiceUrl))
                              .clientId(clientId)
                              .clientSecret(clientSecret)
                              .build()
                              .getToken(rootUserName, rootUserPass)
                              .getAccess_token();
        } catch (Exception e) {
            throw new FailedException("Error get root token");
        }
    }
}
