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

import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
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
    public ObjectValidationResult validate(FeatureDescriptionDto featureDescriptionDto, Map<String, Object> data) {
        ObjectValidationResult validationResult = new ObjectValidationResult();

        ObjectValidationResult customValidationResults = new ObjectValidationResult();
        customRuleValidator
                .validate(featureDescriptionDto, data)
                .values().forEach(validationResult::addObjectViolation);

        featureDescriptionDto.getProperties().forEach(propertySchema -> {
            SimplePropertyDto propertySchema2 = propertySchema;

            propertySchema2 = modifyPropertySchemaByCustomRules(customValidationResults, propertySchema);

            String name = propertySchema2.getName();
            if (data.containsKey(name)) {
                PropertyViolation propertyViolation = new PropertyViolation(name, data.get(name));

                List<String> errors = validateProperty(propertySchema2, data.get(name));

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
     * Создаем новую схему (на основе propertySchema) согласно кастомным правилам.
     *
     * @param propertySchema Схема свойства
     * @return Модифицированную схему свойства SimplePropertyDto если есть доп. правила для этого конкретного обьекта
     * или тот же обьект propertySchema без изменений.
     */
    private SimplePropertyDto modifyPropertySchemaByCustomRules(ObjectValidationResult customValidationResults,
                                                                SimplePropertyDto propertySchema) {
        LocalTime startMTime = LocalTime.now();

        if (!customValidationResults.getObjectViolations().isEmpty()) {
            SimplePropertyDto newPropertySchema = new SimplePropertyDto(propertySchema);
            customValidationResults.getObjectViolations().forEach(errorPropertyName -> {
                if (errorPropertyName.equals(propertySchema.getName())) {
                    newPropertySchema.setRequired(true);
                }
            });

            LocalTime endMTime = LocalTime.now();
            log.debug("Modify: {} for: {}", propertySchema.getName(), ChronoUnit.MILLIS.between(startMTime, endMTime));

            return newPropertySchema;
        } else {

            LocalTime endMTime = LocalTime.now();
            log.debug("Validate batch: {} for: {}", propertySchema.getName(), ChronoUnit.MILLIS.between(startMTime, endMTime));

            return propertySchema;
        }
    }

}
