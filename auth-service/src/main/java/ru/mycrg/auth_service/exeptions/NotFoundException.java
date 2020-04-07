package ru.mycrg.auth_service.exeptions;

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
}
