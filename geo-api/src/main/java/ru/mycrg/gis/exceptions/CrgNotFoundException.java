package ru.mycrg.gis.exceptions;

import javax.persistence.EntityNotFoundException;

public class CrgNotFoundException extends EntityNotFoundException {
	private static final long serialVersionUID = -1152044292992335379L;

	public CrgNotFoundException(String msg) {
		super(msg);
	}

}
