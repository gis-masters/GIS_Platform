package ru.mycrg.wrapper.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.ObjectValidationResult;
import ru.mycrg.common.EntityTypeDto;
import ru.mycrg.common.PropertyViolation;
import ru.mycrg.common.SimplePropertyDto;
import ru.mycrg.common.enums.ValueType;
import ru.mycrg.wrapper.service.validation.constraints.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@Service
public class ValidatorImpl implements IValidator {

    private static Logger log = LoggerFactory.getLogger(ValidatorImpl.class);

    private RequiredValidation requiredValidation = new RequiredValidation();
    private MinLengthValidation minLengthValidation = new MinLengthValidation();
    private MaxLengthValidation maxLengthValidation = new MaxLengthValidation();
    private PatternValidation patternValidation = new PatternValidation();
    private MinInclusiveValidation minInclusiveValidation = new MinInclusiveValidation();
    private MaxInclusiveValidation maxInclusiveValidation = new MaxInclusiveValidation();
    private TotalDigitsValidation totalDigitsValidation = new TotalDigitsValidation();
    private IsLongTypeValidation isLongTypeValidation = new IsLongTypeValidation();
    private IsDoubleTypeValidation isDoubleTypeValidation = new IsDoubleTypeValidation();
    private EnumerationValidation enumerationValidation = new EnumerationValidation();
    private CustomRuleValidation customRuleValidator = new CustomRuleValidation();

    @Override
    public ObjectValidationResult validate(EntityTypeDto entityType, Map<String, Object> data) {
        ObjectValidationResult validationResult = new ObjectValidationResult();

        customRuleValidator.validate(entityType, data).values()
                .forEach(validationResult::addObjectViolation);

        entityType.getProperties().forEach(propertyDto -> {
            String name = propertyDto.getName();
            if (data.containsKey(name)) {
                PropertyViolation propertyViolation = new PropertyViolation(name, data.get(name));
                propertyViolation.setErrorTypes(validateProperty(propertyDto, data.get(name)));

                if (propertyViolation.hasErrors()) {
                    validationResult.addPropertyViolation(propertyViolation);
                }
            }
        });

        return validationResult;
    }

    private List<String> validateProperty(SimplePropertyDto propertyType, Object value) {
        List<String> violations = new ArrayList<>();

        requiredValidation.validate(value, propertyType, violations);

        if (propertyType.getValueType() == ValueType.STRING) {
            minLengthValidation.validate(value, propertyType, violations);
            maxLengthValidation.validate(value, propertyType, violations);
            patternValidation.validate(value, propertyType, violations);
        } else if (propertyType.getValueType() == ValueType.INT) {
            if (isLongTypeValidation.isValid(value, propertyType)) {
                minInclusiveValidation.validate(value, propertyType, violations);
                maxInclusiveValidation.validate(value, propertyType, violations);
            } else {
                isLongTypeValidation.validate(value, propertyType, violations);
            }
        } else if (propertyType.getValueType() == ValueType.DOUBLE) {
            if (isDoubleTypeValidation.isValid(value, propertyType)) {
                totalDigitsValidation.validate(value, propertyType, violations);
            } else {
                isDoubleTypeValidation.validate(value, propertyType, violations);
            }
        } else if (propertyType.getValueType() == ValueType.CHOICE) {
            enumerationValidation.validate(value, propertyType, violations);
        }

        return violations;
    }

}
