package ru.mycrg.integration_service.exceptions;

public class IntegrationServiceException extends RuntimeException {

	public IntegrationServiceException(String msg, Throwable cause) {
		super(msg, cause);
	}

	public IntegrationServiceException(String msg) {
		super(msg);
	}
}
