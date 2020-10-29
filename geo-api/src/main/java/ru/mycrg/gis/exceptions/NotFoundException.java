package ru.mycrg.gis.exceptions;

public class NotFoundException extends RuntimeException {

	public NotFoundException(Object id) {
		super("Ресурс не найден по идентификатору: " + id.toString());
	}

	public NotFoundException(String msg, Throwable cause) {
		super(msg, cause);
	}
}
