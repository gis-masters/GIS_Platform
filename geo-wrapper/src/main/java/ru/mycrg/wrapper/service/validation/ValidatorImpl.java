package ru.mycrg.wrapper.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.mq_queue_contract.*;
import ru.mycrg.mq_queue_contract.enums.ValueType;
import ru.mycrg.wrapper.service.util.CrgScriptEngine;
import ru.mycrg.wrapper.service.validation.constraints.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

@Service
public class ValidatorImpl implements IValidator {

    private static Logger log = LoggerFactory.getLogger(ValidatorImpl.class);

    private final CrgScriptEngine scriptEngine;

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

    public ValidatorImpl(CrgScriptEngine scriptEngine) {
        this.scriptEngine = scriptEngine;
    }

    @Override
    public ObjectValidationResult validate(SchemaDto schemaDto, Map<String, Object> fObject) {
        ObjectValidationResult validationResult = new ObjectValidationResult();

        Object fResult = scriptEngine.invokeFunction(fObject, schemaDto.getCustomRuleFunction());
        Stream.of(fResult)
                .map(next -> {
                    Map<String, Object> item = (Map<String, Object>) next;

                    List<ErrorDescription> result = new ArrayList<>();

                    item.forEach((key, value) -> {
                        Map<String, String> obj = (Map<String, String>) value;

                        result.add(new ErrorDescription(obj.get("attribute"), obj.get("error")));
                    });

                    return result;
                })
                .forEach(errorDescriptions -> errorDescriptions.forEach(validationResult::addObjectViolation));

        schemaDto.getProperties().forEach(propertySchema -> {
            String name = propertySchema.getName();
            if (fObject.containsKey(name)) {
                PropertyViolation propertyViolation = new PropertyViolation(name, fObject.get(name));

                List<String> errors = validateProperty(propertySchema, fObject.get(name));

                propertyViolation.setErrorTypes(errors);

                if (propertyViolation.hasErrors()) {
                    validationResult.addPropertyViolation(propertyViolation);
                }
            }
        });

        return validationResult;
    }

    private List<String> validateProperty(SimplePropertyDto propertySchema, Object value) {
        List<String> violations = new ArrayList<>();

        requiredValidation.validate(value, propertySchema, violations);

        if (propertySchema.getValueType() == ValueType.STRING) {
            minLengthValidation.validate(value, propertySchema, violations);
            maxLengthValidation.validate(value, propertySchema, violations);
            patternValidation.validate(value, propertySchema, violations);
        } else if (propertySchema.getValueType() == ValueType.INT) {
            if (isLongTypeValidation.isValid(value, propertySchema)) {
                minInclusiveValidation.validate(value, propertySchema, violations);
                maxInclusiveValidation.validate(value, propertySchema, violations);
            } else {
                isLongTypeValidation.validate(value, propertySchema, violations);
            }
        } else if (propertySchema.getValueType() == ValueType.DOUBLE) {
            if (isDoubleTypeValidation.isValid(value, propertySchema)) {
                totalDigitsValidation.validate(value, propertySchema, violations);
            } else {
                isDoubleTypeValidation.validate(value, propertySchema, violations);
            }
        } else if (propertySchema.getValueType() == ValueType.CHOICE) {
            enumerationValidation.validate(value, propertySchema, violations);
        }

        return violations;
    }

}
