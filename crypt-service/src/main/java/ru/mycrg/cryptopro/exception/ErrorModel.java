package ru.mycrg.cryptopro.exception;

import org.springframework.http.HttpStatus;

public record ErrorModel(HttpStatus status, String message) {

}
