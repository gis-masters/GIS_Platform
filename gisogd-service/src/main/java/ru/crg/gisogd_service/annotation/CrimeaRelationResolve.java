package ru.crg.gisogd_service.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import ru.crg.gisogd_service.model.rf.RfGuid;

/**
 * Свойства по которым сопоставляется объект классу.
 * @author Vladimir Nomokonov
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface CrimeaRelationResolve {

    String nameStartWith();

    String contentType() default "";

    boolean exclude() default false;

    Class<? extends RfGuid> objectClass();

    String endpoint() default "";
}
