package ru.mycrg.gis.exceptions;

public class NotFoundException extends RuntimeException {

	public NotFoundException(Object id) {
		super("Ресурс не найден по идентификатору: " + (id != null ? id.toString() : "null"));
	}

	public NotFoundException(String msg, Throwable cause) {
		super(msg, cause);
	}
}
