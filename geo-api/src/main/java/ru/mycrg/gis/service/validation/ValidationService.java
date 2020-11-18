package ru.mycrg.gis.service.validation;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.gis.dto.TaskModel;
import ru.mycrg.gis.dto.ValidationRequestDto;
import ru.mycrg.gis.dto.WsMessageDto;
import ru.mycrg.gis.entity.Process;
import ru.mycrg.gis.queue.MqSender;
import ru.mycrg.gis.repository.ProcessRepository;
import ru.mycrg.gis.service.BaseProcessService;
import ru.mycrg.gis.service.SchemaService;
import ru.mycrg.gis.service.WsNotificationService;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;
import ru.mycrg.mq_queue_contract.ResourceProjection;
import ru.mycrg.mq_queue_contract.ValidationMqProcessRequest;
import ru.mycrg.mq_queue_contract.enums.ProcessType;

import java.security.Principal;

import static ru.mycrg.gis.security.CrgClaimsParser.getOrganizationId;
import static ru.mycrg.mq_queue_contract.CrgConstants.DEFAULT_DB_NAME;

@Service
public class ValidationService extends BaseProcessService {

    private static final Logger log = LoggerFactory.getLogger(ValidationService.class);

    private final MqSender mqSender;
    private final SchemaService schemaService;
    private final WsNotificationService wsNotificationService;

    @Autowired
    public ValidationService(MqSender mqSender,
                             SchemaService schemaService,
                             ProcessRepository processRepository,
                             WsNotificationService wsNotificationService) {
        super(processRepository);

        this.mqSender = mqSender;
        this.schemaService = schemaService;
        this.wsNotificationService = wsNotificationService;
    }

    /**
     * Запустить процесс валидации.
     *
     * @param principal Пользователь
     * @param request   Список ресурсов {@link ValidationRequestDto}
     */
    public Process validate(ValidationRequestDto request, Principal principal) {
        long orgId = getOrganizationId(principal);

        Process process = create(
                principal.getName(),
                String.format("Валидация %d слоёв(я) Организации: %s", request.getResources().size(), orgId),
                ProcessType.VALIDATION,
                request);

        ValidationMqProcessRequest payload = new ValidationMqProcessRequest();

        request.getResources().forEach(resourceModel -> {
            schemaService.getSchemaByName(resourceModel.getSchemaId()).ifPresent(schema -> {
                payload.addResourceProjections(
                        new ResourceProjection(DEFAULT_DB_NAME + orgId,
                                               resourceModel.getDataset(),
                                               resourceModel.getTable(),
                                               schema));
            });
        });

        mqSender.send(new BaseMqProcessRequest(process.getId(), ProcessType.VALIDATION, payload));

        return process;
    }

    @Override
    public void handleMqResponse(BaseMqProcessResponse mqResponse) {
        if (mqResponse.getId() == null) {
            log.warn("Return invalid response");
        }

        Process process = getProcessById(mqResponse.getId());
        switch (mqResponse.getStatus()) {
            case PENDING:
            case TASK_ERROR:
            case TASK_DONE:
                addSubStep(process, mqResponse);
                break;
            case ERROR:
                error(process, mqResponse.getError());
                break;
            case DONE:
                complete(process, null);
                break;
            default:
                log.warn("Not supported process status. {}", process);
        }

        JsonNode extraInfo = process.getExtra();
        String wsUiId = "null";
        if (extraInfo != null) {
            wsUiId = extraInfo.get("wsUiId").asText();
        }

        if (ProcessType.VALIDATION.equals(mqResponse.getType())) {
            wsNotificationService.send(new WsMessageDto<>(mqResponse.getType(), mqResponse), wsUiId);
        }
    }

    private void addSubStep(Process process, BaseMqProcessResponse response) {
        try {
            TaskModel subProcess = new TaskModel(
                    response.getPayload().toString(),
                    response.getStatus(),
                    response.getError());

            addTask(process, subProcess);
        } catch (Exception e) {
            log.error("Failed add subStep to process / Error: {}", e.getMessage());
        }
    }
}
