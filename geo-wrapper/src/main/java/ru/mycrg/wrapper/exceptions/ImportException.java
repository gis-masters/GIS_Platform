package ru.mycrg.wrapper.exceptions;

public class ImportException extends RuntimeException {

	public ImportException(String msg) {
		super(msg);
	}

	public ImportException(String msg, Throwable cause) {
		super(msg, cause);
	}
}
