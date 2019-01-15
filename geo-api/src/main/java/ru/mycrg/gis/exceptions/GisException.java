package ru.mycrg.gis.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.I_AM_A_TEAPOT)
public class GisException extends RuntimeException {
	private static final long serialVersionUID = -1153144292122335379L;

	public GisException(String msg) {
		super(msg);
	}
}
