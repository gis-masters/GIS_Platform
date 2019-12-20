package ru.mycrg.oauth_client;

public class OAuthClientException extends Exception {

    OAuthClientException(String s, Throwable throwable) {
        super(s, throwable);
    }
}
