package ru.mycrg.wrapper.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.mycrg.common.ConstraintViolation;
import ru.mycrg.common.EntityTypeDto;
import ru.mycrg.common.ValidationResponse;
import ru.mycrg.wrapper.dao.PostGisStorage;
import ru.mycrg.wrapper.mq.IMqEvents;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    public void startValidation(EntityTypeDto entityTypeDto) {
        postGisStorage.getFromTable("gis", "fiz", entityTypeDto.getTableName());

        List<ConstraintViolation> violations = validator.validate(entityTypeDto, new HashMap<>());

        mqEvents.validationResponse(new ValidationResponse(true, violations));
    }
}
