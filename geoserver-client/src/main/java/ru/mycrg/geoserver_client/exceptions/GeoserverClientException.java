package ru.mycrg.geoserver_client.exceptions;

public class GeoserverClientException extends Exception {

	public GeoserverClientException(String request, String msg) {
		super("Запрос: " + request + " на геосервер привел к ошибке: " + msg);
	}

	public GeoserverClientException(String message, Throwable reason) {
		super(message, reason);
	}
}
