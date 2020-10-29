package ru.mycrg.wrapper.service.validation.constraints;

import ru.mycrg.mq_queue_contract.SimplePropertyDto;
import ru.mycrg.mq_queue_contract.ValueTitleProjection;

import java.util.List;
import java.util.stream.Collectors;

public class EnumerationValidation implements CrgConstraintValidator {

    private static final String TYPE = "enumeration";

    @Override
    public boolean isValid(Object value, SimplePropertyDto context) {
        if (value == null || context.getEnumerations().isEmpty()) {
            return true;
        }

        return context
                .getEnumerations().stream()
                .map(ValueTitleProjection::getValue)
                .collect(Collectors.toList()).contains(value.toString());
    }

    @Override
    public void validate(Object value, SimplePropertyDto context, List<String> violations) {
        if (!isValid(value, context)) {
            violations.add(TYPE);
        }
    }
}
