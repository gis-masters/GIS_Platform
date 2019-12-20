package ru.mycrg.gis.exceptions;

import javax.persistence.EntityNotFoundException;

public class NotFoundException extends EntityNotFoundException {

	public NotFoundException(String msg) {
		super(msg);
	}

}
