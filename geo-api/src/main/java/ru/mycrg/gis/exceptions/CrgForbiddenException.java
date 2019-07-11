package ru.mycrg.gis.exceptions;

import javax.persistence.EntityNotFoundException;

public class CrgForbiddenException extends EntityNotFoundException {
	private static final long serialVersionUID = -1552304212452935831L;

	public CrgForbiddenException(String msg) {
		super(msg);
	}
}
