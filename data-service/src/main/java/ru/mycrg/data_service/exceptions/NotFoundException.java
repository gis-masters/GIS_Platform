package ru.mycrg.data_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;
import ru.mycrg.data_service.service.resources.ResourceQualifier;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class NotFoundException extends RuntimeException {

    public NotFoundException(Object id) {
        super("Ресурс не найден по идентификатору: " + id.toString());
    }

    public NotFoundException(String msg, Object o) {
        super(String.format("%s: '%s'", msg, o.toString()));
    }

    public NotFoundException(ResourceQualifier tableQualifier, Long recordId) {
        super(String.format("В таблице '%s' не найден объект по идентификатору: '%d'",
                            tableQualifier.getQualifier(), recordId));
    }

    public NotFoundException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public NotFoundException(Class<?> clazz, Long id) {
        super("Сущность '" + clazz.getSimpleName() + "' не найдена по идентификатору: " + id);
    }
}
