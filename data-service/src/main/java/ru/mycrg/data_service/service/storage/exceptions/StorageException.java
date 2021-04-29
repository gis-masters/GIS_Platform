package ru.mycrg.data_service.service.storage.exceptions;

public class StorageException extends Exception {

	public StorageException(String msg) {
		super(msg);
	}

	public StorageException(String msg, Throwable cause) {
		super(msg, cause);
	}
}
