package ru.mycrg.auth_service.exceptions;

public class AuthServiceException extends RuntimeException {

	public AuthServiceException(String msg) {
		super(msg);
	}

	public AuthServiceException(String msg, Throwable cause) {
		super(msg, cause);
	}
}
