package ru.mycrg.wrapper.service.validation.constraints;

import ru.mycrg.mq_queue_contract.SimplePropertyDto;

import java.util.List;

public class MaxInclusiveValidation extends IsLongTypeValidation implements CrgConstraintValidator {

    private final String type = "maxInclusive";

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

    @Override
    public void validate(Object value, SimplePropertyDto context, List<String> violations) {
        if (!isValid(value, context)) {
            violations.add(type + ":" + context.getMaxInclusive());
        }
    }

}
