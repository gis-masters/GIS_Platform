package ru.mycrg.notification.exceptions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static java.time.LocalDateTime.now;
import static org.springframework.http.HttpStatus.*;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ErrorResponse> handleBadRequestException(BadRequestException ex) {
        log.error("Не корректный запрос: {}", ex.getMessage());

        return new ResponseEntity<>(new ErrorResponse(BAD_REQUEST.value(), ex.getMessage(), now()), BAD_REQUEST);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(NotFoundException ex) {
        log.error("Ресурс не найден: {}", ex.getMessage());

        return new ResponseEntity<>(new ErrorResponse(NOT_FOUND.value(), ex.getMessage(), now()), NOT_FOUND);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoResourceFoundException(NoResourceFoundException ex) {
        log.error("Ресурс не существует: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                BAD_REQUEST.value(),
                "Запрашиваемый ресурс не существует: " + ex.getResourcePath(),
                now());

        return new ResponseEntity<>(errorResponse, NOT_FOUND);
    }

    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoHandlerFoundException(NoHandlerFoundException ex) {
        log.error("Обработчик не найден: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                NOT_FOUND.value(),
                "Запрашиваемый ресурс не найден: " + ex.getRequestURL(),
                now());

        return new ResponseEntity<>(errorResponse, NOT_FOUND);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleHttpRequestMethodNotSupportedException(
            HttpRequestMethodNotSupportedException ex) {
        log.error("Метод не поддерживается: {}", ex.getMessage());

        String message = "Метод %s не поддерживается для данного ресурса. Поддерживаемые методы: %s"
                .formatted(ex.getMethod(), ex.getSupportedHttpMethods());
        ErrorResponse errorResponse = new ErrorResponse(
                METHOD_NOT_ALLOWED.value(),
                message,
                now());

        return new ResponseEntity<>(errorResponse, METHOD_NOT_ALLOWED);
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ErrorResponse> handleIllegalStateException(IllegalStateException ex) {
        log.error("Недопустимое состояние: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                BAD_REQUEST.value(),
                ex.getMessage(),
                now()
        );

        return new ResponseEntity<>(errorResponse, BAD_REQUEST);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        log.error("Ошибка валидации: {}", errors);

        ValidationErrorResponse errorResponse = new ValidationErrorResponse(
                BAD_REQUEST.value(),
                "Ошибка валидации данных",
                now(),
                errors);

        return new ResponseEntity<>(errorResponse, BAD_REQUEST);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        log.error("Ошибка чтения запроса: {}", ex.getMessage());

        ErrorResponse errorResponse = new ErrorResponse(
                BAD_REQUEST.value(),
                "Отсутствует тело запроса или оно имеет неверный формат",
                now()
        );

        return new ResponseEntity<>(errorResponse, BAD_REQUEST);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex) {
        log.error("Внутренняя ошибка сервера: {}", ex.getMessage(), ex);

        ErrorResponse errorResponse = new ErrorResponse(
                INTERNAL_SERVER_ERROR.value(),
                "Внутренняя ошибка сервера",
                now());

        return new ResponseEntity<>(errorResponse, INTERNAL_SERVER_ERROR);
    }

    public static class ErrorResponse {

        private final int status;
        private final String message;
        private final LocalDateTime timestamp;

        public ErrorResponse(int status, String message, LocalDateTime timestamp) {
            this.status = status;
            this.message = message;
            this.timestamp = timestamp;
        }

        public int getStatus() {
            return status;
        }

        public String getMessage() {
            return message;
        }

        public LocalDateTime getTimestamp() {
            return timestamp;
        }
    }

    public static class ValidationErrorResponse extends ErrorResponse {

        private final Map<String, String> errors;

        public ValidationErrorResponse(int status, String message, LocalDateTime timestamp,
                                       Map<String, String> errors) {
            super(status, message, timestamp);
            this.errors = errors;
        }

        public Map<String, String> getErrors() {
            return errors;
        }
    }
}
