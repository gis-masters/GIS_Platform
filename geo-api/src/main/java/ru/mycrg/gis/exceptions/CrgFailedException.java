package ru.mycrg.gis.exceptions;

public class CrgFailedException extends RuntimeException {
	private static final long serialVersionUID = -3152044292882335379L;

	public CrgFailedException(String msg) {
		super(msg);
	}
}
