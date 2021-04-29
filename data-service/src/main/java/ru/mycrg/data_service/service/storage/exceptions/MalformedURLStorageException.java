package ru.mycrg.data_service.service.storage.exceptions;

public class MalformedURLStorageException extends Exception {

	public MalformedURLStorageException(String msg) {
		super(msg);
	}

	public MalformedURLStorageException(String fileName, Throwable cause) {
		super(String.format("Failed build path to file: '%s' in storage", fileName), cause);
	}
}
