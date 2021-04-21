package ru.mycrg.auth_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class NotFoundException extends RuntimeException {

	public NotFoundException(Object id) {
		super("Сущность не найдена по идентификатору: " + id.toString());
	}

	public NotFoundException(String msg, Throwable cause) {
		super(msg, cause);
	}

	public NotFoundException(Class<?> clazz, Long id) {
		super("Сущность '" + clazz.getSimpleName() + "' не найдена по идентификатору: " + id);
	}
}
