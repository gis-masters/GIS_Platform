package ru.mycrg.data_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class NotFoundException extends RuntimeException {

	public NotFoundException(Object id) {
		super("Ресурс не найден по идентификатору: " + id.toString());
	}

	public NotFoundException(String msg, Throwable cause) {
		super(msg, cause);
	}
}
