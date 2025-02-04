package ru.mycrg.data_service.exceptions;

import javax.validation.ConstraintViolation;
import javax.validation.ValidationException;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class CrgValidationException extends ValidationException {

    private final List<ErrorInfo> errors;

    public <T> CrgValidationException(Set<ConstraintViolation<T>> violations) {
        super("Сущность описана некорректно");

        this.errors = mapViolations(violations);
    }

    private static List<ErrorInfo> mapViolations(Set<? extends ConstraintViolation<?>> constraintViolations) {
        return constraintViolations.stream()
                .map(violation -> {
                    if (violation != null) {
                        return new ErrorInfo(violation.getPropertyPath().toString(), violation.getMessage());
                    } else {
                        return new ErrorInfo();
                    }
                })
                .collect(Collectors.toList());
    }

    public List<ErrorInfo> getErrors() {
        return errors;
    }
}
