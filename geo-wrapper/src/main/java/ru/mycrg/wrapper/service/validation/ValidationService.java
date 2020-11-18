package ru.mycrg.wrapper.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.mq_queue_contract.*;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.dao.DaoProperties;
import ru.mycrg.wrapper.dao.DatasourceFactory;
import ru.mycrg.wrapper.queue.MqSender;
import ru.mycrg.wrapper.service.BaseRequestHandler;
import ru.mycrg.wrapper.service.requests_handler.IRequestHandler;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static java.time.temporal.ChronoUnit.SECONDS;
import static ru.mycrg.mq_queue_contract.enums.ProcessStatus.*;
import static ru.mycrg.wrapper.dao.DaoProperties.CLASS_ID;
import static ru.mycrg.wrapper.dao.DaoProperties.PRIMARY_KEY;
import static ru.mycrg.wrapper.service.export.GmlUtil.calculatePercent;

@Service
public class ValidationService extends BaseRequestHandler implements IRequestHandler {

    private static final Logger log = LoggerFactory.getLogger(ValidationService.class);

    private final MqSender mqSender;
    private final IValidator validator;
    private final BaseDaoService baseDaoService;
    private final DatasourceFactory datasourceFactory;

    private int totalRows = 0;

    @Autowired
    public ValidationService(IValidator validator, MqSender mqSender,
                             BaseDaoService baseDaoService,
                             DatasourceFactory datasourceFactory) {
        this.mqSender = mqSender;
        this.validator = validator;
        this.baseDaoService = baseDaoService;
        this.datasourceFactory = datasourceFactory;
    }

    @Override
    public void handle(BaseMqProcessRequest mqRequest) {
        log.debug("Start validation");

        try {
            ValidationMqProcessRequest payload = mapper.convertValue(mqRequest.getPayload(),
                                                                     ValidationMqProcessRequest.class);

            mqSender.send(new BaseMqProcessResponse(mqRequest, PENDING, "Инициализация...", 0));

            totalRows = (int) calculateTotalRows(payload.getResourceProjections());
            payload.getResourceProjections()
                   .forEach(resource -> validateResource(mqRequest, resource));

            mqSender.send(new BaseMqProcessResponse(mqRequest, DONE, "", 100));
        } catch (Exception e) {
            log.error("Не удалось выполнить валидацию.", e);

            mqSender.send(new BaseMqProcessResponse(mqRequest, ERROR, e.getMessage()));
        }
    }

    private void validateResource(BaseMqProcessRequest mqRequest, ResourceProjection resource) {
        log.debug("Validate resource: {}", resource.getResourceId());

        final SchemaDto schema = resource.getSchema();

        int processedRows = 0;
        try {
            LocalTime startTime = LocalTime.now();
            JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(resource.getDbName());

            List<Map<String, Object>> nextBatch;
            int batchSize = DaoProperties.BATCH_SIZE;
            while (true) {
                nextBatch = baseDaoService.fetchBatchOfRowsNeededToValidation(jdbcTemplate, resource, batchSize);
                if (nextBatch.isEmpty()) {
                    break;
                }

                List<ObjectValidationResult> validationResults = validateBatch(nextBatch, schema);
                baseDaoService.saveValidationResults(jdbcTemplate, resource, validationResults);

                mqSender.send(new BaseMqProcessResponse(mqRequest, PENDING,
                                                        "Обработано: " + schema.getTitle(),
                                                        calculatePercent(processedRows, totalRows)));

                processedRows += batchSize;
            }

            LocalTime endTime = LocalTime.now();
            log.debug("Validation time for resource: {} is: {} seconds", resource, SECONDS.between(startTime, endTime));

            mqSender.send(
                    new BaseMqProcessResponse(mqRequest, resource.toString(), TASK_DONE, "Готово", -1));
        } catch (Exception e) {
            log.error("Не удалось провалидировать: {}", resource, e);

            mqSender.send(
                    new BaseMqProcessResponse(mqRequest, resource.toString(), TASK_ERROR, "Ошибка", e.getMessage()));
        }
    }

    private List<ObjectValidationResult> validateBatch(List<Map<String, Object>> batch,
                                                       SchemaDto featureDescription) {
        List<ObjectValidationResult> validationResults = new ArrayList<>();

        int i = 0;
        while (i < batch.size()) {
            ObjectValidationResult objectValidationResult = validator.validate(featureDescription, batch.get(i));
            objectValidationResult.setObjectId(Util.getPropertyByKey(batch.get(i), PRIMARY_KEY));
            objectValidationResult.setClassId(Util.getPropertyByKey(batch.get(i), CLASS_ID));
            objectValidationResult.setxMin(Util.getPropertyByKey(batch.get(i), "xmin"));

            validationResults.add(objectValidationResult);

            i++;
        }

        return validationResults;
    }

    private long calculateTotalRows(List<ResourceProjection> resources) {
        return resources.stream()
                        .mapToLong(baseDaoService::countTotalRows)
                        .sum();
    }
}
