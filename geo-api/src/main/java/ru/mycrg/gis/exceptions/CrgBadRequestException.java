package ru.mycrg.gis.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class CrgBadRequestException extends RuntimeException {
	private static final long serialVersionUID = -1852044292292335379L;

	public CrgBadRequestException(String msg) {
		super(msg);
	}
}
