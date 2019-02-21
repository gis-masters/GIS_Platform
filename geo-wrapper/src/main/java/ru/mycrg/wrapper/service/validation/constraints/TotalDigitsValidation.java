package ru.mycrg.wrapper.service.validation.constraints;

import ru.mycrg.common.SimplePropertyDto;

import java.util.List;

public class TotalDigitsValidation implements CrgConstraintValidator {

    private final String type = "totalDigits";

    @Override
    public boolean isValid(Object value, SimplePropertyDto context) {
        if (value == null || context.getTotalDigits() == -1) {
            return true;
        }

        return String.valueOf(value).length() <= context.getTotalDigits();
    }

    @Override
    public void validate(Object value, SimplePropertyDto context, List<String> violations) {
        if (!isValid(value, context)) {
            violations.add(type + ":" + context.getTotalDigits());
        }
    }
}
