package ru.mycrg.wrapper.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.ConstraintViolation;
import ru.mycrg.common.EntityTypeDto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ValidatorImpl implements IValidator {

    private static Logger log = LoggerFactory.getLogger(ValidatorImpl.class);

    @Override
    public List<ConstraintViolation> validate(EntityTypeDto entityType, Map<String, String> data) {
        List<ConstraintViolation> violations = new ArrayList<>();

        entityType.getProperties().forEach(propertyDto -> {
            String name = propertyDto.getName();
            if (data.containsKey(name)) {
                String propertyValue = data.get(name);

//                ConstraintViolation violation = propertyDto.startValidation(propertyValue);
//                if (!violation.getViolations().isEmpty()) {
//                    violations.add(violation);
//                }
            }
        });

        return violations;
    }
}
