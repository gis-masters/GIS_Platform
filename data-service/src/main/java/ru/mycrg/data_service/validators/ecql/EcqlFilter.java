package ru.mycrg.data_service.validators.ecql;

import javax.validation.Constraint;
import javax.validation.Payload;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

@Target({METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE})
@Retention(RUNTIME)
@Constraint(validatedBy = EcqlFilterValidator.class)
public @interface EcqlFilter {

    String message() default "ecql фильтр задан некорректно";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
