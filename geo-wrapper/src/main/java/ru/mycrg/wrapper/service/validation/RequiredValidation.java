package ru.mycrg.wrapper.service.validation;

import ru.mycrg.common.SimplePropertyDto;

public class RequiredValidation implements CrgConstraintValidator {

    @Override
    public boolean isValid(Object value, SimplePropertyDto context) {
        if (context.isRequired()) {
            return value != null;
        } else {
            return true;
        }
    }
}
