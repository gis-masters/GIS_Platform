package ru.mycrg.gis.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
public class CrgFailedException extends RuntimeException {
	private static final long serialVersionUID = -3152044292882335379L;

	public CrgFailedException(String msg) {
		super(msg);
	}
}
