package ru.mycrg.gis_service.exceptions;

import ru.mycrg.http_client.ResponseModel;

import java.util.ArrayList;
import java.util.List;

public class ThirdPartyServiceException extends RuntimeException {

	private final List<ErrorInfo> errors = new ArrayList<>();

	public ThirdPartyServiceException(String msg, Throwable cause) {
		super(msg, cause);
	}

	public ThirdPartyServiceException(String msg, ResponseModel<Object> response) {
		super(msg);

		this.errors.add(new ErrorInfo("code", String.valueOf(response.getCode())));

		if (!response.getMsg().isEmpty()) {
			this.errors.add(new ErrorInfo("msg", response.getMsg()));
		}

		Object body = response.getBody();
		if (body != null) {
			this.errors.add(new ErrorInfo("body", body.toString()));
		}
	}

	public List<ErrorInfo> getErrors() {
		return errors;
	}
}
