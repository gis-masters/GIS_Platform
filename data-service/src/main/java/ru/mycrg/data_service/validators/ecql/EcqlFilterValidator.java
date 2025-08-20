package ru.mycrg.data_service.validators.ecql;

import org.jetbrains.annotations.Nullable;
import ru.mycrg.data_service.util.EcqlParser;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;

import static org.springframework.util.StringUtils.isEmpty;

public class EcqlFilterValidator implements ConstraintValidator<EcqlFilter, String> {

    @Override
    public boolean isValid(@Nullable String ecqlFilter, ConstraintValidatorContext context) {
        if (isEmpty(ecqlFilter)) {
            return true;
        }

        return EcqlParser.parse(ecqlFilter)
                         .isPresent();
    }
}
