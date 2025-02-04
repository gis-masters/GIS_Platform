package ru.mycrg.data_service.dao.exceptions;

import java.util.HashMap;
import java.util.Map;

public class CrgDaoException extends Exception {

	private Map<String, String> errors = new HashMap<>();

	public CrgDaoException(String msg) {
		super(msg);
	}

	public CrgDaoException(String msg, Map<String, String> errors) {
		super(msg);

		this.errors = errors;
	}

	public CrgDaoException(String msg, Throwable cause) {
		super(msg, cause);
	}

	public Map<String, String> getErrors() {
		return errors;
	}

	public boolean hasErrors() {
		return !errors.isEmpty();
	}

	public static CrgDaoException recordNotFound(String table, Object recId) {
		return new CrgDaoException(String.format("record not found %s %s", table, recId));
	}
}
