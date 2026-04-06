package ru.mycrg.auth_service.exceptions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindingResult;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;

@ControllerAdvice
public class CustomRestExceptionHandler extends ResponseEntityExceptionHandler {

    private final Logger log = LoggerFactory.getLogger(CustomRestExceptionHandler.class);

    // 400
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(final MethodArgumentNotValidException ex,
                                                                  final HttpHeaders headers,
                                                                  final HttpStatusCode status,
                                                                  final WebRequest request) {
        List<ErrorInfo> errors = mapBindingErrors(ex.getBindingResult());
        ApiErrorModel errorModel =
                new ApiErrorModel(BAD_REQUEST, "Argument validation exception", errors);

        return handleExceptionInternal(ex, errorModel, headers, errorModel.getStatus(), request);
    }

    // 406
    @Override
    protected ResponseEntity<Object> handleHttpMediaTypeNotAcceptable(final HttpMediaTypeNotAcceptableException ex,
                                                                      final HttpHeaders headers,
                                                                      final HttpStatusCode status,
                                                                      final WebRequest request) {
        return ResponseEntity.status(NOT_ACCEPTABLE).build();
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Object> handleBadRequest(final RuntimeException e) {
        BadRequestException ex = (BadRequestException) e;

        ApiErrorModel errorModel = new ApiErrorModel(BAD_REQUEST, ex.getMessage(), ex.getErrors());

        log.error("BAD REQUEST: {}", errorModel.getMessage());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler(value = {ForbiddenException.class, AccessDeniedException.class})
    public ResponseEntity<Object> forbidden(final RuntimeException ex) {
        ApiErrorModel errorModel = new ApiErrorModel(FORBIDDEN, ex.getLocalizedMessage());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Object> handleNotFound(final RuntimeException ex) {
        ApiErrorModel errorModel = new ApiErrorModel(NOT_FOUND, ex.getLocalizedMessage());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<Object> handleConflict(final RuntimeException ex) {
        ApiErrorModel errorModel = new ApiErrorModel(CONFLICT, ex.getLocalizedMessage());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler(TooManyRequestException.class)
    public ResponseEntity<Object> handleTooManyRequestException(final RuntimeException ex) {
        ApiErrorModel errorModel = new ApiErrorModel(TOO_MANY_REQUESTS, ex.getLocalizedMessage());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    private List<ErrorInfo> mapBindingErrors(BindingResult bindingResult) {
        List<ErrorInfo> errors = bindingResult
                .getFieldErrors().stream()
                .map(error -> new ErrorInfo(error.getField(), error.getDefaultMessage()))
                .collect(Collectors.toCollection(ArrayList::new));

        bindingResult.getGlobalErrors().stream()
                     .map(error -> new ErrorInfo(error.getObjectName(), error.getDefaultMessage()))
                     .forEach(errors::add);

        return errors;
    }
}