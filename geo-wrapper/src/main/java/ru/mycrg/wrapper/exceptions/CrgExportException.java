package ru.mycrg.wrapper.exceptions;

public class CrgExportException extends RuntimeException {
	private static final long serialVersionUID = -1652014292128325379L;

	public CrgExportException(String msg) {
		super(msg);
	}

	public CrgExportException(String msg, Throwable cause) {
		super(msg, cause);
	}
}
