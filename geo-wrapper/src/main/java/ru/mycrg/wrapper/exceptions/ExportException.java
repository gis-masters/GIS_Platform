package ru.mycrg.wrapper.exceptions;

import javax.xml.parsers.ParserConfigurationException;

public class ExportException extends RuntimeException {
	private static final long serialVersionUID = -1652014292128325379L;

	public ExportException(String msg) {
		super(msg);
	}

	public ExportException(String msg, Throwable cause) {
		super(msg, cause);
	}
}
