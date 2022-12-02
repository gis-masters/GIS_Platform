package ru.mycrg.wrapper.service.validation.constraints;

import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.util.List;

public class MaxInclusiveValidation extends IsLongTypeValidation implements CrgConstraintValidator {

    private static final String TYPE = "maxInclusive";

    @Override
    public boolean isValid(Object value, SimplePropertyDto context) {
        if (value == null || context.getMaxInclusive() == null) {
            return true;
        }

        if (!super.isValid(value, context)) {
            return false;
        } else {
            long valueAsLong = Long.parseLong(String.valueOf(value));

            return valueAsLong <= context.getMaxInclusive();
        }
    }

    @Override
    public void validate(Object value, SimplePropertyDto context, List<String> violations) {
        if (!isValid(value, context)) {
            violations.add(TYPE + ":" + context.getMaxInclusive());
        }
    }
}
