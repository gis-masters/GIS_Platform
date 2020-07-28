package ru.mycrg.data_service.dao.exceptions;

public class CrgDaoException extends Exception {

	public CrgDaoException(String msg) {
		super(msg);
	}

	public CrgDaoException(String msg, Throwable cause) {
		super(msg, cause);
	}
}
