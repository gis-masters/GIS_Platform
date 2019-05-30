package ru.mycrg.gis.exceptions;

public class CrgBadRequestException extends RuntimeException {
	private static final long serialVersionUID = -1852044292292335379L;

	public CrgBadRequestException(String msg) {
		super(msg);
	}
}
