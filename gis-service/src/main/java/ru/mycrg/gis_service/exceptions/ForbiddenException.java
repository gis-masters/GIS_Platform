package ru.mycrg.gis_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.FORBIDDEN)
public class ForbiddenException extends RuntimeException {

	public ForbiddenException(String msg) {
		super(msg);
	}

	public ForbiddenException(String action, String entity, String title) {
		super(String.format("Недостаточно прав для %s %s: %s", action, entity, title));
	}
}
