package ru.mycrg.auth_service.exeptions;

public class AuthServiceException extends RuntimeException {

	public AuthServiceException(String msg) {
		super(msg);
	}

	public AuthServiceException(String msg, Throwable cause) {
		super(msg, cause);
	}
}
