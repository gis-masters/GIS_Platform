package ru.geoserver.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class FgistpValidator implements IValidator {

    private static Logger log = LoggerFactory.getLogger(FgistpValidator.class);

    @Override
    public List<ConstraintViolationImpl> validate(EntityType entityType, Map<String, String> data) {
        List<ConstraintViolationImpl> violations = new ArrayList<>();

        entityType.getProperties().forEach(abstractProperty -> {
            String name = abstractProperty.getName();
            if (data.containsKey(name)) {
                String propertyValue = data.get(name);

                ConstraintViolationImpl violation = abstractProperty.validate(propertyValue);
                if (!violation.getViolations().isEmpty()) {
                    violations.add(violation);
                }
            }
        });

        return violations;
    }
}
