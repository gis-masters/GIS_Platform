package ru.mycrg.wrapper.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.ConstraintViolation;
import ru.mycrg.common.EntityTypeDto;
import ru.mycrg.common.PropertyViolation;
import ru.mycrg.common.SimplePropertyDto;

import java.util.Map;

@Service
public class ValidatorImpl implements IValidator {

    private static Logger log = LoggerFactory.getLogger(ValidatorImpl.class);

    private String ID_KEY = "objectid";

    @Override
    public ConstraintViolation validate(EntityTypeDto entityType, Map<String, Object> data) {
        ConstraintViolation violation = new ConstraintViolation();

        if (data.containsKey(ID_KEY)) {
            violation.setId(data.get(ID_KEY).toString());
        } else {
            log.warn("Row not contains id? : {}", ID_KEY);
        }

        log.info("-----------------------------");
        entityType.getProperties().forEach(propertyDto -> {
            String name = propertyDto.getName();
            if (data.containsKey(name)) {
                PropertyViolation propertyViolation = new PropertyViolation(name, data.get(name).toString());
                validateProperty(propertyDto, propertyViolation, data.get(name));

                if (propertyViolation.hasErrors()) {
                    violation.addPropertyViolation(propertyViolation);
                }
            }
        });

        return violation;
    }

    private void validateProperty(SimplePropertyDto propertyType, PropertyViolation propertyViolation, Object value) {
        log.info("validateProperty: {}  with value: {}", propertyViolation.getName(), value);
        // TODO: Check and fill errors list
    }
}
