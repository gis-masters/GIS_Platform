package ru.mycrg.wrapper.exceptions;

public class CrgImportException extends RuntimeException {
	private static final long serialVersionUID = -1612014022528325372L;

	public CrgImportException(String msg) {
		super(msg);
	}

	public CrgImportException(String msg, Throwable cause) {
		super(msg, cause);
	}
}
