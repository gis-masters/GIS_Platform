package ru.mycrg.wrapper.service.validation.constraints;

import ru.mycrg.common.SimplePropertyDto;

import java.util.List;

public class MinLengthValidation implements CrgConstraintValidator {

    private final String type = "minLength";

    @Override
    public boolean isValid(Object value, SimplePropertyDto context) {
        if (value == null || context.getMinLength() == -1) {
            return true;
        }

        return value.toString().length() >= context.getMinLength();
    }

    @Override
    public void validate(Object value, SimplePropertyDto context, List<String> violations) {
        if (!isValid(value, context)) {
            violations.add(type + ":" + context.getMinLength());
        }
    }
}
