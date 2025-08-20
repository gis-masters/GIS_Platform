package ru.mycrg.wrapper.service.validation.constraints;

import ru.mycrg.data_service_contract.dto.SimplePropertyDto;

import java.util.List;

public class RequiredValidation implements CrgConstraintValidator {

    private static final String TYPE = "required";

    @Override
    public boolean isValid(Object value, SimplePropertyDto context) {
        if (context.isRequired() == null) {
            return true;
        }

        if (context.isRequired().booleanValue()) {
            return value != null;
        } else {
            return true;
        }
    }

    @Override
    public void validate(Object value, SimplePropertyDto context, List<String> violations) {
        if (!isValid(value, context)) {
            violations.add(TYPE);
        }
    }
}
