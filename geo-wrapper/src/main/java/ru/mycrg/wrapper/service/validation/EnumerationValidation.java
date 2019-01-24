package ru.mycrg.wrapper.service.validation;

import ru.mycrg.common.SimplePropertyDto;
import ru.mycrg.common.propertyTypes.ValueTitleProjection;

import java.util.function.Function;
import java.util.stream.Collectors;

public class EnumerationValidation implements CrgConstraintValidator {

    @Override
    public boolean isValid(Object value, SimplePropertyDto context) {
        if (value == null || context.getEnumerations().isEmpty()) {
            return true;
        }

        return context
                .getEnumerations().stream()
                .map((Function<ValueTitleProjection, Object>) ValueTitleProjection::getValue)
                .collect(Collectors.toList()).contains(value.toString());
    }
}
