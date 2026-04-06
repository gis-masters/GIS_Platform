package ru.mycrg.gis_service.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

import static java.lang.annotation.ElementType.FIELD;

@Documented
@Constraint(validatedBy = CrgParentGroupValidator.class)
@Target({FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface CrgParentGroup {

    String message() default "Родительская группа задана неверно";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
