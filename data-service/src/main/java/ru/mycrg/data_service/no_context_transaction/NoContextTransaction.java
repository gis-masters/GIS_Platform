package ru.mycrg.data_service.no_context_transaction;


import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Аннотация вешается над методом, для которого требуется открыть транзакцию вне http контекста
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface NoContextTransaction {

    /**
     * Имя БД(проперти), к которой требуется выполнить соединение
     */
    String dbProperty();
}
