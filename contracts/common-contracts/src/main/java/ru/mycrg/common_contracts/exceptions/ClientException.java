package ru.mycrg.common_contracts.exceptions;

public class ClientException extends RuntimeException {

    public ClientException(String msg, Throwable cause) {
        super(msg, cause);
    }

    public ClientException(String msg) {
        super(msg);
    }
}
