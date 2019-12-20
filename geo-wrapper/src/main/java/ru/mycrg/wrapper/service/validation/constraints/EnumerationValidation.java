package ru.mycrg.wrapper.service.validation.constraints;

import ru.mycrg.mq_queue_contract.SimplePropertyDto;
import ru.mycrg.mq_queue_contract.propertyTypes.ValueTitleProjection;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

public class EnumerationValidation implements CrgConstraintValidator {

    private final String type = "enumeration";

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

    @Override
    public void validate(Object value, SimplePropertyDto context, List<String> violations) {
        if (!isValid(value, context)) {
            violations.add(type);
        }
    }
}
