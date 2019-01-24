package ru.mycrg.wrapper.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.ConstraintViolation;
import ru.mycrg.common.EntityTypeDto;
import ru.mycrg.common.ValidationRequest;
import ru.mycrg.common.ValidationResponse;
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

    public void startValidation(ValidationRequest validationRequest) {
        EntityTypeDto entityTypeDto = validationRequest.getEntityType();
        String dbName = validationRequest.getDbName();
        String schemaName = validationRequest.getSchemaName();

        List<Map<String, Object>> allRows = postGisStorage.fetchAllRows(dbName, schemaName, entityTypeDto.getTableName());
        if (allRows.isEmpty()) {
            mqEvents.validationResponse(new ValidationResponse(ValidationStatus.EMPTY));
        }

        List<ConstraintViolation> violations = new ArrayList<>();
        int i = 0;
        while (i < allRows.size()) {
            ConstraintViolation violation = validator.validate(entityTypeDto, allRows.get(i));

            if (i % BATCH_SIZE == 0) {
                violations.add(violation);
                mqEvents.validationResponse(
                        new ValidationResponse(ValidationStatus.PENDING, Collections.unmodifiableList(violations)));

                violations.clear();
            } else {
                violations.add(violation);
            }

            i++;
        }

        mqEvents.validationResponse(new ValidationResponse(ValidationStatus.DONE, violations));
    }
}
