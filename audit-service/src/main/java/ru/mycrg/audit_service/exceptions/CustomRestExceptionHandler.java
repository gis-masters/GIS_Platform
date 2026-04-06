package ru.mycrg.audit_service.exceptions;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.NOT_ACCEPTABLE;

@ControllerAdvice
public class CustomRestExceptionHandler extends ResponseEntityExceptionHandler {

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
