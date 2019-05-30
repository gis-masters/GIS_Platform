package ru.mycrg.gis.exceptions;

import javax.persistence.EntityNotFoundException;

public class CrgConflictException extends EntityNotFoundException {
	private static final long serialVersionUID = -1152044292452335331L;

	public CrgConflictException(String msg) {
		super(msg);
	}
}
