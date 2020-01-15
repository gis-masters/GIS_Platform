package ru.mycrg.oauth_client;

public class OAuthClientException extends Exception {

    OAuthClientException(String msg, Throwable throwable) {
        super(msg, throwable);
    }

    OAuthClientException(String msg) {
        super(msg);
    }
}
