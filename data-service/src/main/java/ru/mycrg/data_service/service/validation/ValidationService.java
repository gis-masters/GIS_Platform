package ru.mycrg.data_service.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.data_service.dao.ProcessDao;
import ru.mycrg.data_service.dto.TaskModel;
import ru.mycrg.data_service.dto.ValidationRequestDto;
import ru.mycrg.data_service.dto.WsMessageDto;
import ru.mycrg.data_service.entity.Process;
import ru.mycrg.data_service.queue.MqSender;
import ru.mycrg.data_service.service.BaseProcessService;
import ru.mycrg.data_service.service.SchemaService;
import ru.mycrg.data_service.service.WsNotificationService;
import ru.mycrg.mq_queue_contract.BaseMqProcessRequest;
import ru.mycrg.mq_queue_contract.BaseMqProcessResponse;
import ru.mycrg.mq_queue_contract.ResourceProjection;
import ru.mycrg.mq_queue_contract.ValidationMqProcessRequest;

import java.security.Principal;

import static ru.mycrg.data_service.dao.CrgDataSourcesPool.DEFAULT_DB_NAME;
import static ru.mycrg.data_service.security.CrgClaimsParser.getOrganizationId;
import static ru.mycrg.mq_queue_contract.enums.ProcessType.VALIDATION;

@Service
public class ValidationService extends BaseProcessService {

    private static final Logger log = LoggerFactory.getLogger(ValidationService.class);

    private final MqSender mqSender;
    private final SchemaService schemaService;
    private final WsNotificationService wsNotificationService;

    @Autowired
    public ValidationService(MqSender mqSender,
                             SchemaService schemaService,
                             ProcessDao processDao,
                             WsNotificationService wsNotificationService) {
        super(processDao);

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
        final String dbName = DEFAULT_DB_NAME + orgId;

        Process process = create(
                principal.getName(),
                String.format("Валидация %d слоёв(я) Организации: %s", request.getResources().size(), orgId),
                VALIDATION,
                request);

        ValidationMqProcessRequest payload = new ValidationMqProcessRequest();

        request.getResources().forEach(resourceModel -> {
            schemaService.getSchemaByName(resourceModel.getSchemaId()).ifPresent(schema -> {
                payload.addResourceProjections(
                        new ResourceProjection(dbName,
                                               resourceModel.getDataset(),
                                               resourceModel.getTable(),
                                               schema));
            });
        });

        mqSender.send(new BaseMqProcessRequest(dbName, process.getId(), VALIDATION, payload));

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

        if (VALIDATION.equals(mqResponse.getType())) {
            wsNotificationService.send(new WsMessageDto<>(mqResponse.getType(), mqResponse), getWsUiId(process));
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
