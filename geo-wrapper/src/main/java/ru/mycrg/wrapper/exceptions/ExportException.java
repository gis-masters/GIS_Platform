package ru.mycrg.wrapper.exceptions;

public class ExportException extends RuntimeException {

	public ExportException(String msg) {
		super(msg);
	}

	public ExportException(String msg, Throwable cause) {
		super(msg, cause);
	}
}
