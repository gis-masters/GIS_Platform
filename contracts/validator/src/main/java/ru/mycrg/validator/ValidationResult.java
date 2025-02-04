package ru.mycrg.validator;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Optional;

public class ValidationResult {

    private final boolean valid;
    private final Collection<Error> errors;

    public static ValidationResult ok() {
        return new ValidationResult(true, new ArrayList<>());
    }

    public static ValidationResult fail(final Collection<Error> errors) {
        return new ValidationResult(false, Optional.ofNullable(errors).orElse(new ArrayList<>()));
    }

    public ValidationResult(boolean valid, Collection<Error> errors) {
        this.valid = valid;
        this.errors = Collections.unmodifiableCollection(errors);
    }

    public boolean isValid() {
        return valid;
    }

    public Collection<Error> getErrors() {
        return errors;
    }
}
