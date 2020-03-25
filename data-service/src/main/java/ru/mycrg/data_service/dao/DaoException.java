package ru.mycrg.data_service.dao;

public class DaoException extends Exception {

	public DaoException(String msg) {
		super(msg);
	}

	public DaoException(String msg, Throwable cause) {
		super(msg, cause);
	}
}
