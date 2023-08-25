package ru.crg.gisogd_service.exception;

/**
 * Aggregate object error.
 * @author Vladimir Nomokonov
 */
public class AggregateObjectException extends RuntimeException {
    private static final String MESSAGE = "Aggregate object error for type %s";

    public AggregateObjectException(String className, Exception exception) {
        super(String.format(MESSAGE, className), exception);
    }
}
