package ru.mycrg.wrapper.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.common.*;
import ru.mycrg.common.enums.ValidationStatus;
import ru.mycrg.wrapper.dao.PostGisStorage;
import ru.mycrg.wrapper.mq.IMqEvents;

import java.util.*;

@Service
public class ValidationService {

    private static final Logger log = LoggerFactory.getLogger(ValidationService.class);

    private final IMqEvents mqEvents;
    private final IValidator validator;
    private final PostGisStorage postGisStorage;

    private final int BATCH_SIZE = 100;
    private String OBJECT_ID = "objectid";
    private String EXTENSION_ID_KEY = "object_id";
    private String VIOLATIONS_KEY = "violations";

    private List<ValidationMqRequest> currentRequests = new ArrayList<>();

    @Autowired
    public ValidationService(IValidator validator, IMqEvents mqEvents, PostGisStorage postGisStorage) {
        this.mqEvents = mqEvents;
        this.validator = validator;
        this.postGisStorage = postGisStorage;
    }

    public void getResults(ValidationMqRequest validationMqRequest) {
        ValidationMqResponse response = new ValidationMqResponse(validationMqRequest.getId());

        JdbcTemplate jdbcTemplate = postGisStorage.initConnection(validationMqRequest.getDbName());
        Long totalViolations = postGisStorage.countTotalViolations(jdbcTemplate, validationMqRequest);
        if (totalViolations > 0) {
            List<Map<String, Object>> violations = postGisStorage.getViolations(jdbcTemplate, validationMqRequest);

            log.info("Found {} violations", violations.size());
            response.setResults(mapToViolations(violations));
        }

        response.setTotal(totalViolations);
        response.setStatus(ValidationStatus.DONE);

        mqEvents.validationResponse(response);
    }

    public void startValidation(ValidationMqRequest validationMqRequest) {
        ValidationMqResponse response = new ValidationMqResponse(validationMqRequest.getId());

        JdbcTemplate jdbcTemplate = postGisStorage.initConnection(validationMqRequest.getDbName());

        int offset = 0;
        while (true) {
            response.setResults(new ArrayList<>());

            List<Map<String, Object>> batch = postGisStorage
                    .fetchBatchOfRowsNeededValidation(
                            jdbcTemplate,
                            validationMqRequest.getSchemaName(),
                            validationMqRequest.getEntityType().getTableName(),
                            BATCH_SIZE,
                            offset
                    );

            // TODO: Возникновение ошибки при обработке пакета не должны прекращать обработку других пакетов? или должны
            // типа если один с ошибкой то и большая вероятность что другие тоже...
            if (offset == 0 && batch.isEmpty()) {
                response.setStatus(ValidationStatus.EMPTY);

                mqEvents.validationResponse(response);
                break;
            } else if (offset > 0 && batch.isEmpty()) {
                break;
            } else {
                List<ObjectValidationResult> violationResults = validateBatch(batch, validationMqRequest.getEntityType());

                postGisStorage.saveValidationResults(
                        jdbcTemplate,
                        violationResults,
                        validationMqRequest.getSchemaName(),
                        validationMqRequest.getEntityType().getTableName(), EXTENSION_ID_KEY);

                offset++;
            }
        }

        List<Map<String, Object>> violations = postGisStorage.getViolations(jdbcTemplate, validationMqRequest);

        response.setStatus(ValidationStatus.DONE);
        response.setResults(mapToViolations(violations));

        mqEvents.validationResponse(response);
    }

    private List<ObjectValidationResult> mapToViolations(List<Map<String, Object>> violations) {
        List<ObjectValidationResult> results = new ArrayList<>();

        int i = 0;
        while (i < violations.size()) {
            ObjectValidationResult objectValidationResult = new ObjectValidationResult();
            objectValidationResult.setObjectId(Util.getPropertyByKey(violations.get(i), EXTENSION_ID_KEY));
            objectValidationResult.setViolationAsString(Util.getViolations(violations.get(i), VIOLATIONS_KEY));

            results.add(objectValidationResult);

            i++;
        }

        return results;
    }

    private List<ObjectValidationResult> validateBatch(List<Map<String, Object>> batch, EntityTypeDto entityType) {
        List<ObjectValidationResult> validationResults = new ArrayList<>();

        int i = 0;
        while (i < batch.size()) {
            ObjectValidationResult objectValidationResult = validator.validate(entityType, batch.get(i));
            objectValidationResult.setObjectId(Util.getPropertyByKey(batch.get(i), OBJECT_ID));
            objectValidationResult.setxMin(Util.getPropertyByKey(batch.get(i), "xmin"));

            validationResults.add(objectValidationResult);

            i++;
        }

        return validationResults;
    }
}
