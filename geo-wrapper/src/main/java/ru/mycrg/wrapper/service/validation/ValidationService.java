package ru.mycrg.wrapper.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.ConstraintViolation;
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

    @Autowired
    public ValidationService(IValidator validator, IMqEvents mqEvents, PostGisStorage postGisStorage) {
        this.mqEvents = mqEvents;
        this.validator = validator;
        this.postGisStorage = postGisStorage;
    }

    public void startValidation(ValidationMqRequest validationMqRequest) {
        EntityTypeDto entityTypeDto = validationMqRequest.getEntityType();
        String dbName = validationMqRequest.getDbName();
        String schemaName = validationMqRequest.getSchemaName();

        List<Map<String, Object>> allRows = postGisStorage.fetchAllRows(dbName, schemaName, entityTypeDto.getTableName());

        ValidationMqResponse response = new ValidationMqResponse(validationMqRequest.getId(), Math.round(allRows.size() / 100));
        if (allRows.isEmpty()) {
            response.setStatus(ValidationStatus.EMPTY);
            mqEvents.validationResponse(response);
        }

        List<ConstraintViolation> violations = new ArrayList<>();
        int i = 0;
        while (i < allRows.size()) {
            ConstraintViolation violation = validator.validate(entityTypeDto, allRows.get(i));

            if (i % BATCH_SIZE == 0) {
                if (!violation.getPropertyViolations().isEmpty()) {
                    violations.add(violation);
                }

                response.setStatus(ValidationStatus.PENDING);
                response.setViolations(Collections.unmodifiableList(violations));
                mqEvents.validationResponse(response);

                violations.clear();
            } else {
                if (!violation.getPropertyViolations().isEmpty()) {
                    violations.add(violation);
                }
            }

            i++;
        }

        response.setStatus(ValidationStatus.DONE);
        response.setViolations(violations);

        mqEvents.validationResponse(response);
    }
}
