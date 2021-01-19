package ru.mycrg.data_service.service.import_;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.ProcessDao;
import ru.mycrg.data_service.dto.TaskModel;
import ru.mycrg.data_service.dto.WorkImport;
import ru.mycrg.data_service.dto.WsMessageDto;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.exceptions.DataServiceException;
import ru.mycrg.data_service.queue.MqSender;
import ru.mycrg.data_service.service.BaseProcessService;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.WsNotificationService;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;
import ru.mycrg.mq_queue_contract.ResourceProjection;
import ru.mycrg.mq_queue_contract.SchemaDto;
import ru.mycrg.mq_queue_contract.import_.ImportMqResponse;
import ru.mycrg.mq_queue_contract.import_.ImportMqTask;
import ru.mycrg.oauth_client.OAuthClient;

import java.net.URL;
import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static ru.mycrg.data_service.dao.CrgDataSourcesPool.DEFAULT_DB_NAME;
import static ru.mycrg.data_service.security.CrgAuthHelper.getToken;
import static ru.mycrg.data_service.security.CrgClaimsParser.getOrganizationId;
import static ru.mycrg.data_service.service.JsonConverter.mapper;
import static ru.mycrg.mq_queue_contract.enums.ProcessType.IMPORT;

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
                         ProcessDao processDao,
                         WsNotificationService wsNotificationService) {
        super(processDao);

        this.mqSender = mqSender;
        this.environment = environment;
        this.schemaService = schemaService;
        this.wsNotificationService = wsNotificationService;
    }

    public Process initProcess(long projectId, String datasetName, WorkImport workImport, Principal principal) {
        long orgId = getOrganizationId(principal);
        String dbName = DEFAULT_DB_NAME + orgId;

        Process process = create(principal.getName(),
                                 String.format("Импорт %d слоя(ёв) в dataset: %s", workImport.getImportTasks().size(),
                                               datasetName),
                                 IMPORT, workImport.getWsUiId());

        List<ImportMqTask> importMqRequest = new ArrayList<>();
        workImport.getImportTasks().forEach(uiTask -> {
            String workTableName = uiTask.getWorkTableName().toLowerCase();

            SchemaDto schemaDto = new SchemaDto();
            Optional<SchemaDto> oDescription = schemaService.getSchemaByName(uiTask.getSchemaName());
            if (oDescription.isPresent()) {
                schemaDto = oDescription.get();

                log.debug("Import by schema: {}", schemaDto.getName());
            } else {
                schemaDto.setName(workTableName);
                schemaDto.setTableName(workTableName);

                log.debug("Import AsIs, workTableName: {}", workTableName);
            }

            String layerName = String.format("%s_%d_%s", schemaDto.getName(), projectId,
                                             UUID.randomUUID().toString().substring(0, 4));

            ImportMqTask importMqTask = new ImportMqTask(
                    layerName,
                    schemaDto.getName(),
                    "scratch_database_" + orgId,
                    projectId,
                    schemaDto,
                    new ResourceProjection(dbName, "public", uiTask.getLayerName()),
                    new ResourceProjection(dbName, datasetName, layerName, schemaDto),
                    uiTask.getPairs(),
                    uiTask.getSrs(),
                    getRootAccessToken(),
                    getToken(principal)
            );

            importMqRequest.add(importMqTask);
        });

        mqSender.send(new BaseMqProcessRequest(dbName, process.getId(), IMPORT, importMqRequest));

        return process;
    }

    @Override
    public void handleMqResponse(BaseMqProcessResponse mqResponse) {
        if (mqResponse.getId() == null) {
            log.warn("Return invalid mqResponse");
        }

        Process process = getProcessById(mqResponse.getId(), mqResponse.getDbName());
        log.info("catch import response event: {} / {}", mqResponse.getId(), mqResponse.getStatus());
        switch (mqResponse.getStatus()) {
            case TASK_ERROR:
            case TASK_DONE:
                addSubStep(process, mqResponse);
                break;
            case ERROR:
                error(mqResponse.getDbName(), process);
                break;
            case DONE:
                complete(mqResponse.getDbName(), process);
                break;
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
            throw new DataServiceException("Error get root token");
        }
    }
}
