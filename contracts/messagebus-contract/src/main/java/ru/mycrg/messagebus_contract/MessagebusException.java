package ru.mycrg.messagebus_contract;

/**
 * Base RuntimeException for errors that occur when consume events.
 */
public class MessagebusException extends RuntimeException {

	public MessagebusException(String msg, Throwable cause) {
		super(msg, cause);
	}
}
