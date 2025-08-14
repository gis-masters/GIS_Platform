package ru.mycrg.gis_service.exceptions;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.TypeMismatchException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.BindingResult;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;

@ControllerAdvice
public class CustomRestExceptionHandler extends ResponseEntityExceptionHandler {

    private final Logger log = LoggerFactory.getLogger(CustomRestExceptionHandler.class);

    // 400
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(final MethodArgumentNotValidException ex,
                                                                  final HttpHeaders headers,
                                                                  final HttpStatus status,
                                                                  final WebRequest request) {
        final List<ErrorInfo> errors = mapBindingErrors(ex.getBindingResult());
        final ApiErrorModel errorModel =
                new ApiErrorModel(BAD_REQUEST, "Argument validation exception", errors);

        return handleExceptionInternal(ex, errorModel, headers, errorModel.getStatus(), request);
    }

    // 400
    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(final HttpMessageNotReadableException ex,
                                                                  final HttpHeaders headers,
                                                                  final HttpStatus status,
                                                                  final WebRequest request) {
        final ApiErrorModel errorModel = new ApiErrorModel(BAD_REQUEST, "Not readable request body");

        return handleExceptionInternal(ex, errorModel, headers, errorModel.getStatus(), request);
    }

    @Override
    protected ResponseEntity<Object> handleTypeMismatch(final TypeMismatchException ex,
                                                        final HttpHeaders headers,
                                                        final HttpStatus status,
                                                        final WebRequest request) {
        final String errorMsg = String.format("%s value for %s should be of type %s",
                                              ex.getValue(), ex.getPropertyName(), ex.getRequiredType());

        ErrorInfo error = new ErrorInfo(ex.getPropertyName(), errorMsg);
        final ApiErrorModel errorModel = new ApiErrorModel(BAD_REQUEST, ex.getLocalizedMessage(), error);

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @Override
    protected ResponseEntity<Object> handleMissingServletRequestPart(final MissingServletRequestPartException ex,
                                                                     final HttpHeaders headers,
                                                                     final HttpStatus status,
                                                                     final WebRequest request) {
        final String errorMsg = ex.getRequestPartName() + " part is missing";
        ErrorInfo error = new ErrorInfo(ex.getRequestPartName(), errorMsg);
        final ApiErrorModel errorModel = new ApiErrorModel(BAD_REQUEST, ex.getLocalizedMessage(), error);

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @Override
    protected ResponseEntity<Object> handleMissingServletRequestParameter(
            final MissingServletRequestParameterException ex,
            final HttpHeaders headers,
            final HttpStatus status,
            final WebRequest request) {
        final String errorMsg = ex.getParameterName() + " parameter is missing";
        ErrorInfo error = new ErrorInfo(ex.getParameterName(), errorMsg);
        final ApiErrorModel errorModel = new ApiErrorModel(BAD_REQUEST, ex.getLocalizedMessage(), error);

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    // 404
    @Override
    protected ResponseEntity<Object> handleNoHandlerFoundException(final NoHandlerFoundException ex,
                                                                   final HttpHeaders headers,
                                                                   final HttpStatus status,
                                                                   final WebRequest request) {
        final String errorMsg = "No handler found for " + ex.getHttpMethod() + " " + ex.getRequestURL();
        final ApiErrorModel errorModel = new ApiErrorModel(NOT_FOUND, errorMsg);

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    // 405
    @Override
    protected ResponseEntity<Object> handleHttpRequestMethodNotSupported(
            final HttpRequestMethodNotSupportedException ex,
            final HttpHeaders headers,
            final HttpStatus status,
            final WebRequest request) {
        final StringBuilder builder = new StringBuilder();
        builder.append(ex.getMethod());
        builder.append(" method is not supported for this request. Supported methods are ");
        Objects.requireNonNull(ex.getSupportedHttpMethods()).forEach(t -> builder.append(t).append(" "));

        final ApiErrorModel errorModel = new ApiErrorModel(METHOD_NOT_ALLOWED, builder.toString());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    // 415
    @Override
    protected ResponseEntity<Object> handleHttpMediaTypeNotSupported(final HttpMediaTypeNotSupportedException ex,
                                                                     final HttpHeaders headers,
                                                                     final HttpStatus status,
                                                                     final WebRequest request) {
        final StringBuilder builder = new StringBuilder();
        builder.append(ex.getContentType());
        builder.append(" media type is not supported. Supported media types are ");
        ex.getSupportedMediaTypes().forEach(t -> builder.append(t).append(" "));

        final ApiErrorModel errorModel =
                new ApiErrorModel(UNSUPPORTED_MEDIA_TYPE, builder.substring(0, builder.length() - 2));

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    //
    @ExceptionHandler({MethodArgumentTypeMismatchException.class})
    public ResponseEntity<Object> handleMethodArgumentTypeMismatch(final MethodArgumentTypeMismatchException ex,
                                                                   final WebRequest request) {
        log.info("handleMethodArgumentTypeMismatch WebRequest: {}", request);

        String typeName = "";
        final Class<?> requiredType = ex.getRequiredType();
        if (requiredType != null) {
            typeName = requiredType.getName();
        }

        final String errorMsg = ex.getName() + " should be of type " + typeName;
        ErrorInfo error = new ErrorInfo(ex.getName(), errorMsg);
        final ApiErrorModel errorModel = new ApiErrorModel(BAD_REQUEST, ex.getLocalizedMessage(), error);

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler({ConstraintViolationException.class})
    public ResponseEntity<Object> handleConstraintViolation(final ConstraintViolationException ex) {
        final List<ErrorInfo> errors = new ArrayList<>();
        for (final ConstraintViolation<?> violation: ex.getConstraintViolations()) {
            errors.add(new ErrorInfo(violation.getRootBeanClass().getName(), violation.getMessage()));
        }

        final ApiErrorModel errorModel = new ApiErrorModel(BAD_REQUEST, ex.getLocalizedMessage(), errors);

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    // 500
    @ExceptionHandler({Exception.class})
    public ResponseEntity<Object> handleAll(final Exception ex) {
        final ApiErrorModel errorModel = new ApiErrorModel(INTERNAL_SERVER_ERROR,
                                                           "Shit happens: " + ex.getMessage());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler({ThirdPartyServiceException.class})
    public ResponseEntity<Object> handleThirdPartyException(final ThirdPartyServiceException ex) {
        final ApiErrorModel errorModel = new ApiErrorModel(INTERNAL_SERVER_ERROR, ex.getMessage(), ex.getErrors());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler(GisServiceException.class)
    public ResponseEntity<Object> internalExceptionsHandler(final RuntimeException ex) {
        GisServiceException gEx = (GisServiceException) ex;
        ApiErrorModel errorModel = new ApiErrorModel(INTERNAL_SERVER_ERROR, ex.getMessage(), gEx.getErrors());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    // Handle CrgExceptions
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Object> handleNotFound(final RuntimeException ex) {
        final ApiErrorModel errorModel = new ApiErrorModel(NOT_FOUND, ex.getLocalizedMessage());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Object> handleBadRequest(final BadRequestException ex) {
        final ApiErrorModel errorModel = new ApiErrorModel(BAD_REQUEST, ex.getLocalizedMessage(), ex.getErrors());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<Object> handleConflict(final RuntimeException ex) {
        final ApiErrorModel errorModel = new ApiErrorModel(CONFLICT, ex.getLocalizedMessage());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler(value = {ForbiddenException.class, AccessDeniedException.class})
    public ResponseEntity<Object> forbidden(final RuntimeException ex) {
        final ApiErrorModel errorModel = new ApiErrorModel(FORBIDDEN, ex.getLocalizedMessage());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler(BindingErrorsException.class)
    public ResponseEntity<Object> bindingHandler(final RuntimeException ex) {
        final BindingErrorsException bindEx = (BindingErrorsException) ex;

        final ApiErrorModel errorModel = new ApiErrorModel(BAD_REQUEST, bindEx.getMessage(),
                                                           mapBindingErrors(bindEx.getBindingResult()));

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    private List<ErrorInfo> mapBindingErrors(BindingResult bindingResult) {
        ArrayList<ErrorInfo> errors = bindingResult.getFieldErrors().stream()
                                                   .map(error -> new ErrorInfo(error.getField(),
                                                                               error.getDefaultMessage()))
                                                   .collect(Collectors.toCollection(ArrayList::new));

        bindingResult.getGlobalErrors().stream()
                     .map(error -> new ErrorInfo(error.getObjectName(), error.getDefaultMessage()))
                     .forEach(errors::add);

        return errors;
    }
}
