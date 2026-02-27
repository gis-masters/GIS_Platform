package ru.mycrg.report_service.config.custom_annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * <a href="https://habr.com/ru/articles/861262">Пример с хабра</a>
 * . При необходимости масштабировать - не бояться ElementType поставить как Class
 */

@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface RequiresCarboneHealth {

}
