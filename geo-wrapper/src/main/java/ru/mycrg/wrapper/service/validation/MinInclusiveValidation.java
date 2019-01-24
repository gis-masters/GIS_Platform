package ru.mycrg.wrapper.service.validation;

import ru.mycrg.common.SimplePropertyDto;

public class MinInclusiveValidation extends IsLongTypeValidation implements CrgConstraintValidator {

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
}
