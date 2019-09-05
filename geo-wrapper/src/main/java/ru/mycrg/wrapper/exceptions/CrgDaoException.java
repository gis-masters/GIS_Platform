package ru.mycrg.wrapper.exceptions;

public class CrgDaoException extends Exception {
	private static final long serialVersionUID = -1122314292128525379L;

	public CrgDaoException(String msg) {
		super(msg);
	}

	public CrgDaoException(String msg, Throwable cause) {
		super(msg, cause);
	}
}
