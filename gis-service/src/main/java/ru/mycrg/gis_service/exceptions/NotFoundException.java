package ru.mycrg.gis_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class NotFoundException extends RuntimeException {

	public NotFoundException(String msg) {
		super(msg);
	}

	public NotFoundException(long id) {
		super("Сущность не найдена по идентификатору: " + id);
	}

	public NotFoundException(Class<?> clazz, Long id) {
		super("Сущность '" + clazz.getSimpleName() + "' не найдена по идентификатору: " + id);
	}
}
