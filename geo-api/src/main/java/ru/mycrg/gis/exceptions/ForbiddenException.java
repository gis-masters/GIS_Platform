package ru.mycrg.gis.exceptions;

import javax.persistence.EntityNotFoundException;

public class ForbiddenException extends RuntimeException {

	public ForbiddenException(String msg) {
		super(msg);
	}
}
