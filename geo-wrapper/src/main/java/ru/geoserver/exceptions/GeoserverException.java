package ru.geoserver.exceptions;

public class GeoserverException extends RuntimeException {
	private static final long serialVersionUID = -1152044292122335379L;

	public GeoserverException(String request, String msg) {
		super("Запрос: " + request + " на геосервер привел к ошибке: " + msg);
	}
}
