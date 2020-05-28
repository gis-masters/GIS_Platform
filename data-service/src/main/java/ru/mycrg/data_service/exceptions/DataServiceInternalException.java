package ru.mycrg.data_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
public class DataServiceInternalException extends RuntimeException {

	public DataServiceInternalException(String msg, Throwable cause) {
		super(msg, cause);
	}

	public DataServiceInternalException(String msg) {
		super(msg);
	}
}
