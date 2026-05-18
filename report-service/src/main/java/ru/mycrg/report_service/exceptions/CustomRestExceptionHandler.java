package ru.mycrg.report_service.exceptions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;

@RestControllerAdvice
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

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Void> accessDenied() {
        return new ResponseEntity<>(FORBIDDEN);
    }

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Object> handleNotFound(final NotFoundException ex) {
        ApiErrorModel errorModel = new ApiErrorModel(NOT_FOUND, ex.getMessage());

        log.debug("NOT FOUND: {}", errorModel.getMessage());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Object> handleBadRequest(final BadRequestException ex) {
        ApiErrorModel errorModel = new ApiErrorModel(BAD_REQUEST, ex.getMessage(), ex.getErrors());

        log.error("BAD REQUEST: {}", errorModel.getMessage());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler(CarboneUnavailableException.class)
    public ResponseEntity<Object> handleCarboneUnavailableException(final CarboneUnavailableException ex) {
        ApiErrorModel errorModel = new ApiErrorModel(BAD_REQUEST, ex.getMessage());

        log.error("CarboneUnavailableException: {}", errorModel.getMessage());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleAll(final Exception ex) {
        String msg = "☠ Something went wrong ☠";

        log.error(msg, ex);
        log.debug("Exception class: {}", ex.getClass().getSimpleName());

        ApiErrorModel errorModel = new ApiErrorModel(INTERNAL_SERVER_ERROR, msg);

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
