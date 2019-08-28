package ru.mycrg.wrapper.geoserver_client.exceptions;

public class GeoserverClientException extends Exception {
	private static final long serialVersionUID = -1152044292122335379L;

	public GeoserverClientException(String request, String msg) {
		super("Запрос: " + request + " на геосервер привел к ошибке: " + msg);
	}

	public GeoserverClientException(String message, Throwable reason) {
		super(message, reason);
	}
}
