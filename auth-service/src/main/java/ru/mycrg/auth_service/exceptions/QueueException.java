package ru.mycrg.auth_service.exceptions;

public class QueueException extends Exception {

	public QueueException(String msg) {
		super(msg);
	}

	public QueueException(String msg, Throwable cause) {
		super(msg, cause);
	}
}
