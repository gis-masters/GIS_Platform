package ru.mycrg.wrapper.service.validation;

import org.springframework.stereotype.Service;
import ru.mycrg.common_utils.CrgScriptEngine;
import ru.mycrg.data_service_contract.dto.*;
import ru.mycrg.data_service_contract.enums.ValueType;
import ru.mycrg.wrapper.service.validation.constraints.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import static java.util.Objects.nonNull;

@Service
public class ValidatorImpl implements IValidator {

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

        Map<String, String> propsWithValidationFormula = getPropertiesWithValidationFormula(schemaDto);
        List<ErrorDescription> errorDescriptions = new ArrayList<>();

        propsWithValidationFormula.forEach((key, formula) -> {
            String error = validatePropertiesByFormula(fObject, key, formula);

            errorDescriptions.add(new ErrorDescription(key, error));
        });

        errorDescriptions.forEach(validationResult::addObjectViolation);

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

        if (propertySchema.getValueTypeAsEnum() == ValueType.STRING) {
            minLengthValidation.validate(value, propertySchema, violations);
            maxLengthValidation.validate(value, propertySchema, violations);
            patternValidation.validate(value, propertySchema, violations);
        } else if (propertySchema.getValueTypeAsEnum() == ValueType.INT) {
            if (isLongTypeValidation.isValid(value, propertySchema)) {
                minInclusiveValidation.validate(value, propertySchema, violations);
                maxInclusiveValidation.validate(value, propertySchema, violations);
            } else {
                isLongTypeValidation.validate(value, propertySchema, violations);
            }
        } else if (propertySchema.getValueTypeAsEnum() == ValueType.DOUBLE) {
            if (isDoubleTypeValidation.isValid(value, propertySchema)) {
                totalDigitsValidation.validate(value, propertySchema, violations);
            } else {
                isDoubleTypeValidation.validate(value, propertySchema, violations);
            }
        } else if (propertySchema.getValueTypeAsEnum() == ValueType.CHOICE) {
            enumerationValidation.validate(value, propertySchema, violations);
        }

        return violations;
    }

    private Map<String, String> getPropertiesWithValidationFormula(SchemaDto schema) {
        Map<String, String> propsWithValidationFormula = new HashMap<>();
        schema.getProperties().forEach(simplePropertyDto -> {
            if (nonNull(simplePropertyDto.getValidationFormula())) {
                propsWithValidationFormula.put(simplePropertyDto.getName().toLowerCase(),
                                               simplePropertyDto.getValidationFormula());
            }
        });

        return propsWithValidationFormula;
    }

    private String validatePropertiesByFormula(Map<String, Object> fullProperties,
                                               String fieldName,
                                               String validationFormula) {
        String result = "";

        if (fullProperties.containsKey(fieldName)) {
            result = scriptEngine.invokeFunctionAsString(fullProperties, validationFormula);
        }

        return result;
    }
}
