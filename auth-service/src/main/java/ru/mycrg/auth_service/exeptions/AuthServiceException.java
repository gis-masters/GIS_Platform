package ru.mycrg.auth_service.exeptions;

public class AuthServiceException extends RuntimeException {

	public AuthServiceException(String msg) {
		super(msg);
	}
}
