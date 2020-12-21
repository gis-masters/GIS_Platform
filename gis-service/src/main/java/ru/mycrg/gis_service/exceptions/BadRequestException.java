package ru.mycrg.gis_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.ArrayList;
import java.util.List;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class BadRequestException extends RuntimeException {

	private final List<ErrorInfo> errors = new ArrayList<>();

	public BadRequestException(String msg) {
		super(msg);
	}

	public BadRequestException(String msg, ErrorInfo errorInfo) {
		super(msg);

		errors.add(errorInfo);
	}

	public List<ErrorInfo> getErrors() {
		return errors;
	}
}
