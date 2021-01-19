package ru.mycrg.data_service.service.export;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.ProcessDao;
import ru.mycrg.data_service.dto.DetailsModel;
import ru.mycrg.data_service.dto.ExportRequestModel;
import ru.mycrg.data_service.dto.TaskModel;
import ru.mycrg.data_service.dto.WsMessageDto;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.queue.MqSender;
import ru.mycrg.data_service.service.BaseProcessService;
import ru.mycrg.data_service.service.JsonConverter;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.WsNotificationService;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;
import ru.mycrg.mq_queue_contract.MqExportProcessRequest;
import ru.mycrg.mq_queue_contract.ResourceProjection;
import ru.mycrg.mq_queue_contract.enums.ProcessType;

import java.io.IOException;

import static ru.mycrg.data_service.dao.CrgDataSourcesPool.DEFAULT_DB_NAME;
import static ru.mycrg.data_service.security.CrgClaimsParser.getOrganizationId;
import static ru.mycrg.data_service.service.JsonConverter.mapper;
import static ru.mycrg.mq_queue_contract.enums.ProcessStatus.PENDING;

@Service
public class ExportService extends BaseProcessService {

    private static final Logger log = LoggerFactory.getLogger(ExportService.class);

    private final MqSender mqSender;
    private final SchemaService schemaService;
    private final WsNotificationService wsNotificationService;

    public ExportService(MqSender mqSender,
                         SchemaService schemaService,
                         ProcessDao processDao,
                         WsNotificationService wsNotificationService) {
        super(processDao);

        this.mqSender = mqSender;
        this.schemaService = schemaService;
        this.wsNotificationService = wsNotificationService;
    }

    public Process export(ExportRequestModel request, Authentication authentication) {
        long orgId = getOrganizationId(authentication);
        final String dbName = DEFAULT_DB_NAME + orgId;

        Process process = create(authentication.getName(),
                                 String.format("Экспорт. Кол-во слоев: %d", request.getResources().size()),
                                 ProcessType.EXPORT,
                                 request);

        MqExportProcessRequest payload = new MqExportProcessRequest();
        payload.setFormat(request.getFormat());
        payload.setDocSchema(request.getDocSchema());

        request.getResources().forEach(resourceModel -> {
            schemaService.getSchemaByName(resourceModel.getSchemaId()).ifPresent(schema -> {
                payload.addResource(
                        new ResourceProjection(dbName,
                                               resourceModel.getDataset(),
                                               resourceModel.getTable(),
                                               schema));
            });
        });

        BaseMqProcessRequest mqRequest = new BaseMqProcessRequest(dbName, process.getId(), ProcessType.EXPORT, payload);
        mqSender.send(mqRequest);

        BaseMqProcessResponse processResponse = new BaseMqProcessResponse(mqRequest);
        processResponse.setDescription("Инициализация");
        processResponse.setStatus(PENDING);
        processResponse.setPayload(payload);

        wsNotificationService.send(new WsMessageDto<>(ProcessType.EXPORT, processResponse), request.getWsUiId());

        return process;
    }

    @Override
    public void handleMqResponse(BaseMqProcessResponse mqResponse) {
        if (mqResponse.getId() == null) {
            log.warn("Return invalid response");
        }

        Process process = getProcessById(mqResponse.getId(), mqResponse.getDbName());
        switch (mqResponse.getStatus()) {
            case PENDING:
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

        wsNotificationService.send(new WsMessageDto<>(mqResponse.getType(), mqResponse), getWsUiId(process));
    }

    private void addSubStep(Process process, BaseMqProcessResponse mqResponse) {
        String tableName = mqResponse.getPayload().toString();
        process.setStatus(mqResponse.getStatus());

        try {
            String content = "{}";
            if (process.getDetails() != null) {
                content = process.getDetails().toString();
            }

            DetailsModel details = mapper.readValue(content, DetailsModel.class);

            TaskModel subProcess = new TaskModel(tableName, mqResponse.getStatus(),
                                                 mqResponse.getError());

            details.addTask(subProcess);

            JsonNode jsonNode = JsonConverter.toJsonNode(details);

            process.setDetails(jsonNode);
        } catch (IOException e) {
            log.error("Failed write details to process / Error: {}", e.getMessage());
        }

        log.debug("Add subStep to process: {}", process.getId());
    }
}
