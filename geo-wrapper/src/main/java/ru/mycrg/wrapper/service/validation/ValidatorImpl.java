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

    @Override
    public ObjectValidationResult validate(EntityTypeDto entityType, Map<String, Object> data) {
        ObjectValidationResult validationResult = new ObjectValidationResult();

        entityType.getProperties().forEach(propertyDto -> {
            String name = propertyDto.getName();
            if (data.containsKey(name)) {
                PropertyViolation propertyViolation = new PropertyViolation(name, data.get(name));
                propertyViolation.setErrors(validateProperty(propertyDto, data.get(name)));

                if (propertyViolation.hasErrors()) {
                    validationResult.addPropertyViolation(propertyViolation);
                } else {
                    validationResult.addCorrectProperty(name);
                }
            }
        });

        return validationResult;
    }

    private List<String> validateProperty(SimplePropertyDto propertyType, Object value) {
        List<String> violations = new ArrayList<>();

        if (!requiredValidation.isValid(value, propertyType)) {
            violations.add("Свойство обязательно к заполнению");
        }

        if (propertyType.getValueType() == ValueType.STRING) {
            if (!minLengthValidation.isValid(value, propertyType)) {
                violations.add("Минимальная длинна " + propertyType.getMinLength());
            }

            if (!maxLengthValidation.isValid(value, propertyType)) {
                violations.add("Максимальная длинна " + propertyType.getMaxLength());
            }

            if (!patternValidation.isValid(value, propertyType)) {
                violations.add(propertyType.getPatternDescription());
            }
        } else if (propertyType.getValueType() == ValueType.INT) {
            if (isLongTypeValidation.isValid(value, propertyType)) {
                if (!minInclusiveValidation.isValid(value, propertyType)) {
                    violations.add("Значение должно быть более или равно: " + propertyType.getMinInclusive());
                }

                if (!maxInclusiveValidation.isValid(value, propertyType)) {
                    violations.add("Значение должно быть менее или равно: " + propertyType.getMaxInclusive());
                }
            } else {
                violations.add("Значение должно быть целым числом");
            }
        } else if (propertyType.getValueType() == ValueType.DOUBLE) {
            if (isDoubleTypeValidation.isValid(value, propertyType)) {
                if (!totalDigitsValidation.isValid(value, propertyType)) {
                    violations.add("Общее кол-во знаков не должно превышать: " + propertyType.getTotalDigits());
                }
            } else {
                violations.add("Значение должно быть дробным числом");
            }
        } else if (propertyType.getValueType() == ValueType.CHOICE) {
            if (!enumerationValidation.isValid(value, propertyType)) {
                violations.add("Значение не соответствует справочному");
            }
        }

        return violations;
    }

}