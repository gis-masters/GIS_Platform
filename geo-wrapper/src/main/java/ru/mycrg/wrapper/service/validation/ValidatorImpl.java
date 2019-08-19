package ru.mycrg.wrapper.service.validation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import ru.mycrg.common.FeatureDescriptionDto;
import ru.mycrg.common.ObjectValidationResult;
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
    private CustomRuleValidation customRuleValidator = new CustomRuleValidation();

    @Override
    public ObjectValidationResult validate(FeatureDescriptionDto featureDescriptionDto, Map<String, Object> fObject) {
        ObjectValidationResult validationResult = new ObjectValidationResult();

        customRuleValidator
                .validate(featureDescriptionDto, fObject)
                .values().forEach(validationResult::addObjectViolation);

        featureDescriptionDto.getProperties().forEach(propertySchema -> {
            // Если есть дополнительные правила, дополним ими схему свойства
            List<String> objectViolations = validationResult.getObjectViolations();
            if (!objectViolations.isEmpty()) {
                modifyPropertySchemaByCustomRules(objectViolations, propertySchema);
            }

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

    /**
     * Модифицируем propertySchema согласно кастомным правилам.
     * Посути, просто проставляем required для тех полей которые вылезли в результате применения кастомных правил.
     *
     * @param objectViolations Список параметров для которых нужно проставить required.
     * @param propertySchema   Схема свойства
     */
    private void modifyPropertySchemaByCustomRules(List<String> objectViolations,
                                                   SimplePropertyDto propertySchema) {
        objectViolations.forEach(errorPropertyName -> {
            if (errorPropertyName.toLowerCase().equals(propertySchema.getName().toLowerCase())) {
                propertySchema.setRequired(true);
            }
        });
    }

}
