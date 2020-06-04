package ru.mycrg.data_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
public class DataServiceException extends RuntimeException {

	public DataServiceException(String msg, Throwable cause) {
		super(msg, cause);
	}

	public DataServiceException(String msg) {
		super(msg);
	}
}
