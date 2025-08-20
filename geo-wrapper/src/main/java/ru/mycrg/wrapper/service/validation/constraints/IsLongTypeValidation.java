package ru.mycrg.wrapper.service.validation.constraints;

import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.util.List;

public class IsLongTypeValidation implements CrgConstraintValidator {

    private static final String TYPE = "notLongType";

    @Override
    public boolean isValid(Object value, SimplePropertyDto context) {
        if (value == null) {
            return true;
        }

        try {
            Long.valueOf(String.valueOf(value));

            return true;
        } catch (NumberFormatException e) {
            return false;
        }
    }

    @Override
    public void validate(Object value, SimplePropertyDto context, List<String> violations) {
        if (!isValid(value, context)) {
            violations.add(TYPE);
        }
    }
}
