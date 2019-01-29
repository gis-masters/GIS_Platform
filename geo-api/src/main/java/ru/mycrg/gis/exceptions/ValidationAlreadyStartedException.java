package ru.mycrg.gis.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.CONFLICT)
public class ValidationAlreadyStartedException extends RuntimeException {
	private static final long serialVersionUID = -1153244292128335379L;

	public ValidationAlreadyStartedException(String msg) {
		super(msg);
	}
}
