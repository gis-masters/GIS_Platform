package ru.mycrg.gis_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
public class GisServiceException extends RuntimeException {

	public GisServiceException(String msg, Throwable cause) {
		super(msg, cause);
	}

	public GisServiceException(String msg) {
		super(msg);
	}
}
