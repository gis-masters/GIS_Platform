package ru.mycrg.gis.exceptions;

import javax.persistence.EntityNotFoundException;

public class ForbiddenException extends EntityNotFoundException {

	public ForbiddenException(String msg) {
		super(msg);
	}
}
