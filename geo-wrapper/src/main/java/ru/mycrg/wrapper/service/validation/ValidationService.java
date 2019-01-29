package ru.mycrg.wrapper.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import ru.mycrg.common.ObjectValidationResult;
import ru.mycrg.common.EntityTypeDto;
import ru.mycrg.common.ValidationMqRequest;
import ru.mycrg.common.ValidationMqResponse;
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

    private List<ValidationMqRequest> currentRequests = new ArrayList<>();

    @Autowired
    public ValidationService(IValidator validator, IMqEvents mqEvents, PostGisStorage postGisStorage) {
        this.mqEvents = mqEvents;
        this.validator = validator;
        this.postGisStorage = postGisStorage;
    }

    public void startValidation(ValidationMqRequest validationMqRequest) {
        // handleRequests(validationMqRequest);

        ValidationMqResponse response = new ValidationMqResponse(validationMqRequest.getId());

        JdbcTemplate jdbcTemplate = postGisStorage.initConnection(validationMqRequest.getDbName());

        int offsetMultiple = 0;
        while (true) {
            response.setBatchNumber(offsetMultiple);
            response.setResults(new ArrayList<>());

            List<Map<String, Object>> batch = postGisStorage
                    .fetchBatch(
                            jdbcTemplate,
                            validationMqRequest.getSchemaName(),
                            validationMqRequest.getEntityType().getTableName(),
                            BATCH_SIZE,
                            offsetMultiple
                    );

            if (offsetMultiple == 0 && batch.isEmpty()) {
                response.setStatus(ValidationStatus.EMPTY);

                mqEvents.validationResponse(response);
                break;
            } else if (offsetMultiple > 0 && batch.isEmpty()) {
                response.setStatus(ValidationStatus.DONE);

                mqEvents.validationResponse(response);
                break;
            } else {
                List<ObjectValidationResult> violationResults = validateBatch(batch, validationMqRequest.getEntityType());

                response.setStatus(ValidationStatus.PENDING);
                response.setResults(violationResults);

                mqEvents.validationResponse(response);

                offsetMultiple++;
            }
        }
    }

    private List<ObjectValidationResult> validateBatch(List<Map<String, Object>> batch, EntityTypeDto entityType) {
        List<ObjectValidationResult> validationResults = new ArrayList<>();

        int i = 0;
        while (i < batch.size()) {
            validationResults.add(validator.validate(entityType, batch.get(i)));

            i++;
        }

        return validationResults;
    }
}
