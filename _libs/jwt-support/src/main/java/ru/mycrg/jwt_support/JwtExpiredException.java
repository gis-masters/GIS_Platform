package ru.mycrg.jwt_support;

public class JwtExpiredException extends IllegalArgumentException {

    public JwtExpiredException(String message) {
        super(message);
    }
}
