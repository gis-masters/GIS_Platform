package ru.mycrg.wrapper.service.validation.constraints;

import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.util.List;

public class MaxLengthValidation implements CrgConstraintValidator {

    private static final String TYPE = "maxLength";

    @Override
    public boolean isValid(Object value, SimplePropertyDto context) {
        if (value == null || context.getMaxLength() == null) {
            return true;
        }

        return value.toString().length() <= context.getMaxLength();
    }

    @Override
    public void validate(Object value, SimplePropertyDto context, List<String> violations) {
        if (!isValid(value, context)) {
            violations.add(TYPE + ":" + context.getMaxLength());
        }
    }
}
