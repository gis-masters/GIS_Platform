package ru.mycrg.gis.exceptions;

import javax.persistence.EntityNotFoundException;

public class ConflictException extends EntityNotFoundException {

	public ConflictException(String msg) {
		super(msg);
	}
}
