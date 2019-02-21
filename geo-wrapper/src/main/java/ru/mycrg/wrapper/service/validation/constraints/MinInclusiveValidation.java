package ru.mycrg.wrapper.service.validation.constraints;

import ru.mycrg.common.SimplePropertyDto;

import java.util.List;

public class MinInclusiveValidation extends IsLongTypeValidation implements CrgConstraintValidator {

    private final String type = "minInclusive";

    @Override
    public boolean isValid(Object value, SimplePropertyDto context) {
        if (value == null || context.getMinInclusive() == -1) {
            return true;
        }

        if (!super.isValid(value, context)) {
            return false;
        } else {
            Long valueAsLong = Long.valueOf(String.valueOf(value));

            return valueAsLong >= context.getMinInclusive();
        }
    }

    @Override
    public void validate(Object value, SimplePropertyDto context, List<String> violations) {
        if (!isValid(value, context)) {
            violations.add(type + ":" + context.getMinInclusive());
        }
    }

}
