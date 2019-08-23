package ru.mycrg.wrapper.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.common.*;
import ru.mycrg.wrapper.dao.BaseDaoService;
import ru.mycrg.wrapper.dao.DaoProperties;
import ru.mycrg.wrapper.dao.DatasourceFactory;
import ru.mycrg.wrapper.queue.MqSender;
import ru.mycrg.wrapper.service.BaseRequestHandler;
import ru.mycrg.wrapper.service.requests_handler.IRequestHandler;

import java.time.LocalDateTime;
import java.util.*;

import static ru.mycrg.common.enums.ProcessStatus.*;
import static ru.mycrg.wrapper.dao.DaoProperties.CLASS_ID;
import static ru.mycrg.wrapper.dao.DaoProperties.OBJECT_ID;
import static ru.mycrg.wrapper.service.export.GmlUtil.calculatePercent;
import static ru.mycrg.wrapper.service.export.GmlUtil.getRuleByTableName;

@Service
public class ValidationService extends BaseRequestHandler implements IRequestHandler {

    private static final Logger log = LoggerFactory.getLogger(ValidationService.class);

    private final MqSender mqSender;
    private final IValidator validator;
    private final BaseDaoService baseDaoService;
    private final DatasourceFactory datasourceFactory;

    private int totalRows = 0;
    private int processedRows = 0;

    private Map<String, LocalDateTime> lastCalculatedValidation = new HashMap<>();
    private long totalViolations;
    private boolean isNotValidatedYet = true;

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
            ValidationMqProcessRequest payload = mapper.convertValue(mqRequest.getPayload(), ValidationMqProcessRequest.class);

            mqSender.send(new BaseMqProcessResponse(mqRequest, PENDING, "Инициализация...", 0));

            totalRows = (int) calculateTotalRows(payload.getResourceProjections());
            payload.getResourceProjections()
                   .forEach(resource -> validateResource(mqRequest, resource, processedRows));

            mqSender.send(new BaseMqProcessResponse(mqRequest, DONE, "", 100));
        } catch (Exception e) {
            log.error("Не удалось выполнить валидацию.", e);

            mqSender.send(new BaseMqProcessResponse(mqRequest, ERROR, e.getMessage()));
        }
    }

    private void validateResource(BaseMqProcessRequest mqRequest, ResourceProjection resource, int processedRows) {
        log.debug("Validate resource: {}", resource.getResourceId());

        ValidationMqProcessRequest payload = mapper.convertValue(mqRequest.getPayload(), ValidationMqProcessRequest.class);
        try {
            FeatureDescriptionDto feature = getRuleByTableName(payload.getFeatures(), resource.getTableName());

            JdbcTemplate jdbcTemplate = datasourceFactory.getJdbcTemplate(resource.getDbName());

            // определим как будем подсчитывать общее кол-во ошибок в слое.
            if (baseDaoService.isValidated(jdbcTemplate, resource)) {
                totalViolations = baseDaoService.countTotalViolations(jdbcTemplate, resource);
                isNotValidatedYet = false;
            } else {
                totalViolations = 0;
                isNotValidatedYet = true;
            }

            lastCalculatedValidation.put(resource.getResourceId(), LocalDateTime.now());

            List<Map<String, Object>> nextBatch;
            int batchSize = DaoProperties.BATCH_SIZE;
            while (true) {
                nextBatch = baseDaoService.fetchBatchOfRowsNeededToValidation(jdbcTemplate, resource, batchSize);
                if (nextBatch.isEmpty()) {
                    break;
                }

                List<ObjectValidationResult> validationResults = validateBatch(nextBatch, feature);
                baseDaoService.saveValidationResults(jdbcTemplate, resource, validationResults);

                mqSender.send(new BaseMqProcessResponse(mqRequest, PENDING,
                        "Обработано: " + feature.getTitle(), calculatePercent(processedRows, totalRows)));

                processedRows += batchSize;
            }

            mqSender.send(new BaseMqProcessResponse(mqRequest, resource.getTableName(), TASK_DONE, "Готово", -1));
        } catch (Exception e) {
            log.error("Не удалось провалидировать: " + resource.getTableName(), e);

            mqSender.send(new BaseMqProcessResponse(mqRequest, resource.getTableName(), TASK_ERROR, "Ошибка", e.getMessage()));
        }
    }

    private List<ObjectValidationResult> validateBatch(List<Map<String, Object>> batch,
                                                       FeatureDescriptionDto featureDescription) {
        List<ObjectValidationResult> validationResults = new ArrayList<>();

        int i = 0;
        while (i < batch.size()) {
            ObjectValidationResult objectValidationResult = validator.validate(featureDescription, batch.get(i));
            objectValidationResult.setObjectId(Util.getPropertyByKey(batch.get(i), OBJECT_ID));
            objectValidationResult.setClassId(Util.getPropertyByKey(batch.get(i), CLASS_ID));
            objectValidationResult.setxMin(Util.getPropertyByKey(batch.get(i), "xmin"));

            validationResults.add(objectValidationResult);

            i++;
        }

        return validationResults;
    }

    private long countCorrectObjects(Queue<List<ObjectValidationResult>> validationResult) {
        return validationResult
                .stream()
                .flatMap(Collection::stream)
                .filter(objectViolation -> objectViolation.getPropertyViolations().isEmpty())
                .count();
    }

    private long countIncorrectObjects(Queue<List<ObjectValidationResult>> validationResult) {
        return validationResult
                .stream()
                .flatMap(Collection::stream)
                .filter(objectViolation -> !objectViolation.getPropertyViolations().isEmpty())
                .count();
    }

    private long calculateTotalRows(List<ResourceProjection> resources) {
        return resources.stream()
                .mapToLong(baseDaoService::countTotalRows)
                .sum();
    }

}
