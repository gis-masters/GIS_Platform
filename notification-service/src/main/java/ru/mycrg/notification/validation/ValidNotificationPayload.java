package ru.mycrg.notification.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Аннотация для валидации payload уведомления в зависимости от типа
 */
@Documented
@Constraint(validatedBy = NotificationPayloadValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidNotificationPayload {
    String message() default "Некорректные данные в payload";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}