package ru.mycrg.data_service.service.storage.exceptions;

public class NoSuchFileStorageException extends Exception {

	public NoSuchFileStorageException(String msg) {
		super(msg);
	}

	public NoSuchFileStorageException(String fileName, Throwable cause) {
		super(String.format("No file: '%s' in storage", fileName), cause);
	}
}
