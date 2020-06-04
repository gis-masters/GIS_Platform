package ru.mycrg.gis.service.export;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.gis.dto.DetailsModel;
import ru.mycrg.gis.dto.ExportRequestModel;
import ru.mycrg.gis.dto.TaskModel;
import ru.mycrg.gis.dto.WsMessageDto;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.exceptions.ConflictException;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.repository.ProcessRepository;
import ru.mycrg.gis.service.BaseProcessService;
import ru.mycrg.gis.service.SchemaService;
import ru.mycrg.gis.service.WsNotificationService;
import ru.mycrg.gis.service.JsonConverter;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;
import ru.mycrg.mq_queue_contract.MqExportProcessRequest;
import ru.mycrg.mq_queue_contract.ResourceProjection;
import ru.mycrg.mq_queue_contract.enums.ProcessType;

import java.io.IOException;
import java.security.Principal;

import static ru.mycrg.gis.security.CrgClaimsParser.getOrganizationId;
import static ru.mycrg.mq_queue_contract.CrgConstants.DEFAULT_DB_NAME;
import static ru.mycrg.mq_queue_contract.enums.ProcessStatus.PENDING;

@Service
public class ExportService extends BaseProcessService {

    private static Logger log = LoggerFactory.getLogger(ExportService.class);

    private final MqSender mqSender;
    private final SchemaService schemaService;
    private final WsNotificationService wsNotificationService;

    public ExportService(MqSender mqSender,
                         SchemaService schemaService,
                         ProcessRepository processRepository,
                         WsNotificationService wsNotificationService) {
        super(processRepository);

        this.mqSender = mqSender;
        this.schemaService = schemaService;
        this.wsNotificationService = wsNotificationService;
    }

    public Process export(String projectName, ExportRequestModel request, Principal principal) {
        long orgId = getOrganizationId(principal);

        if (request.getFormat() != null && !request.getFormat().equals("ESRI Shapefile")) {
            throw new ConflictException("Формат: " + request.getFormat() + ", не поддерживается");
        }

        Process process = create(principal.getName(),
                String.format("Экспорт. Проект: %s. Кол-во слоев: %d", projectName, request.getLayers().size()),
                ProcessType.EXPORT, request);

        MqExportProcessRequest payload = new MqExportProcessRequest();
        payload.setFormat(request.getFormat());
        payload.setDocSchema(request.getDocSchema());

        request.getLayers().forEach(layerName -> {
            schemaService.getSchemaByLayerName(layerName).ifPresent(schema -> {
                payload.addRule(schema);
                payload.addResource(
                        new ResourceProjection(DEFAULT_DB_NAME + orgId, projectName, layerName));
            });
        });

        BaseMqProcessRequest mqRequest = new BaseMqProcessRequest(process.getId(), ProcessType.EXPORT, payload);
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
        String pathToFile = mqResponse.getPayload().toString();

        if (mqResponse.getId() == null) {
            log.warn("Return invalid response");
        }

        Process process = getProcessById(mqResponse.getId());
        switch (mqResponse.getStatus()) {
            case PENDING:
            case TASK_ERROR:
            case TASK_DONE:  addSubStep(process, mqResponse);        break;
            case ERROR:     error(process, mqResponse.getError());  break;
            case DONE:      complete(process, pathToFile);          break;
            default:
                log.warn("Not supported process status. {}", process);
        }

        String wsUiId = "";
        JsonNode extra = process.getExtra();
        if (extra != null && extra.get("wsUiId") != null) {
            wsUiId = extra.get("wsUiId").asText();
        }

        wsNotificationService.send(new WsMessageDto<>(mqResponse.getType(), mqResponse), wsUiId);
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
