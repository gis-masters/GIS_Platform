package ru.mycrg.wrapper.service.validation.constraints;

import ru.mycrg.common.SimplePropertyDto;

public class MaxInclusiveValidation extends IsLongTypeValidation implements CrgConstraintValidator {

    @Override
    public boolean isValid(Object value, SimplePropertyDto context) {
        if (value == null || context.getMaxInclusive() == -1) {
            return true;
        }

        if (!super.isValid(value, context)) {
            return false;
        } else {
            Long valueAsLong = Long.valueOf(String.valueOf(value));

            return valueAsLong <= context.getMaxInclusive();
        }
    }
}
