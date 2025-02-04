package ru.crg.gisogd_service.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Define reverse mapping object.
 * @author Vladimir Nomokonov
 */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
public @interface ReverseMapping {

    String value();

    boolean skipcheck() default false;
}
