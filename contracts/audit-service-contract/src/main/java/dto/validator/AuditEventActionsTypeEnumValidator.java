package dto.validator;

import dto.AuditEventActionsType;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Arrays;

public class AuditEventActionsTypeEnumValidator implements ConstraintValidator<ValueOfEnum, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null) {
            return true;
        }

        return Arrays.stream(AuditEventActionsType.values()).anyMatch(e -> e.name().equals(value));
    }
}
