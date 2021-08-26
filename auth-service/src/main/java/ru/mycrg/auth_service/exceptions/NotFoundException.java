package ru.mycrg.auth_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class NotFoundException extends RuntimeException {

    public NotFoundException(String entityType, Object id) {
        super(String.format("%s не найден(а) по идентификатору: %s", entityType, id.toString()));
    }

    public NotFoundException(Object id) {
        this("Сущность", id);
    }

    public NotFoundException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public NotFoundException(Class<?> clazz, Long id) {
        super("Сущность '" + clazz.getSimpleName() + "' не найдена по идентификатору: " + id);
    }
}
