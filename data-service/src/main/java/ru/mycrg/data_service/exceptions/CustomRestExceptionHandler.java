package ru.mycrg.data_service.exceptions;

import org.hibernate.validator.internal.engine.path.PathImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.TypeMismatchException;
import org.springframework.core.env.Environment;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
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
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartException;
import org.springframework.web.multipart.support.MissingServletRequestPartException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import javax.validation.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.*;
import static ru.mycrg.data_service.util.DetailedLogger.logError;

@ControllerAdvice
public class CustomRestExceptionHandler extends ResponseEntityExceptionHandler {

    private final Logger log = LoggerFactory.getLogger(CustomRestExceptionHandler.class);

    private final Environment environment;

    public CustomRestExceptionHandler(Environment environment) {
        this.environment = environment;
    }

    // 400
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(final MethodArgumentNotValidException ex,
                                                                  final HttpHeaders headers,
                                                                  final HttpStatus status,
                                                                  final WebRequest request) {
        List<ErrorInfo> errors = mapBindingErrors(ex.getBindingResult());
        ApiErrorModel errorModel =
                new ApiErrorModel(BAD_REQUEST, "Argument validation exception", errors);

        return handleExceptionInternal(ex, errorModel, headers, errorModel.getStatus(), request);
    }

    // 400
    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(final HttpMessageNotReadableException ex,
                                                                  final HttpHeaders headers,
                                                                  final HttpStatus status,
                                                                  final WebRequest request) {
        ApiErrorModel errorModel = new ApiErrorModel(BAD_REQUEST,
                "Not readable request body. Reason: " + ex.getMessage());

        return handleExceptionInternal(ex, errorModel, headers, errorModel.getStatus(), request);
    }

    @Override
    protected ResponseEntity<Object> handleTypeMismatch(final TypeMismatchException ex,
                                                        final HttpHeaders headers,
                                                        final HttpStatus status,
                                                        final WebRequest request) {
        String errorMsg = String.format("%s value for %s should be of type %s",
                ex.getValue(), ex.getPropertyName(), ex.getRequiredType());

        ErrorInfo error = new ErrorInfo(ex.getPropertyName(), errorMsg);
        ApiErrorModel errorModel = new ApiErrorModel(BAD_REQUEST, ex.getLocalizedMessage(), error);

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @Override
    protected ResponseEntity<Object> handleMissingServletRequestPart(final MissingServletRequestPartException ex,
                                                                     final HttpHeaders headers,
                                                                     final HttpStatus status,
                                                                     final WebRequest request) {
        String errorMsg = ex.getRequestPartName() + " part is missing";
        ErrorInfo error = new ErrorInfo(ex.getRequestPartName(), errorMsg);
        ApiErrorModel errorModel = new ApiErrorModel(BAD_REQUEST, ex.getLocalizedMessage(), error);

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @Override
    protected ResponseEntity<Object> handleMissingServletRequestParameter(
            final MissingServletRequestParameterException ex,
            final HttpHeaders headers,
            final HttpStatus status,
            final WebRequest request) {
        String errorMsg = ex.getParameterName() + " parameter is missing";
        ErrorInfo error = new ErrorInfo(ex.getParameterName(), errorMsg);
        ApiErrorModel errorModel = new ApiErrorModel(BAD_REQUEST, ex.getLocalizedMessage(), error);

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    // 404
    @Override
    protected ResponseEntity<Object> handleNoHandlerFoundException(final NoHandlerFoundException ex,
                                                                   final HttpHeaders headers,
                                                                   final HttpStatus status,
                                                                   final WebRequest request) {
        String errorMsg = "No handler found for " + ex.getHttpMethod() + " " + ex.getRequestURL();
        ApiErrorModel errorModel = new ApiErrorModel(NOT_FOUND, errorMsg);

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    // 405
    @Override
    protected ResponseEntity<Object> handleHttpRequestMethodNotSupported(
            final HttpRequestMethodNotSupportedException ex,
            final HttpHeaders headers,
            final HttpStatus status,
            final WebRequest request) {
        StringBuilder builder = new StringBuilder();
        builder.append(ex.getMethod());
        builder.append(" method is not supported for this request. Supported methods are ");
        Objects.requireNonNull(ex.getSupportedHttpMethods()).forEach(t -> builder.append(t).append(" "));

        ApiErrorModel errorModel = new ApiErrorModel(METHOD_NOT_ALLOWED, builder.toString());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    // 415
    @Override
    protected ResponseEntity<Object> handleHttpMediaTypeNotSupported(final HttpMediaTypeNotSupportedException ex,
                                                                     final HttpHeaders headers,
                                                                     final HttpStatus status,
                                                                     final WebRequest request) {
        StringBuilder builder = new StringBuilder();
        builder.append(ex.getContentType());
        builder.append(" media type is not supported. Supported media types are ");
        ex.getSupportedMediaTypes().forEach(t -> builder.append(t).append(" "));

        ApiErrorModel errorModel =
                new ApiErrorModel(UNSUPPORTED_MEDIA_TYPE, builder.substring(0, builder.length() - 2));

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    //
    @ExceptionHandler({MethodArgumentTypeMismatchException.class})
    public ResponseEntity<Object> handleMethodArgumentTypeMismatch(final MethodArgumentTypeMismatchException ex) {
        String typeName = "";
        Class<?> requiredType = ex.getRequiredType();
        if (requiredType != null) {
            typeName = requiredType.getName();
        }

        String errorMsg = ex.getName() + " should be of type " + typeName;
        ErrorInfo error = new ErrorInfo(ex.getName(), errorMsg);
        ApiErrorModel errorModel = new ApiErrorModel(BAD_REQUEST, ex.getLocalizedMessage(), error);

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler({ResourceNotFoundException.class})
    public ResponseEntity<Object> handleMethodArgumentTypeMismatch(final ResourceNotFoundException ex) {
        ApiErrorModel errorModel = new ApiErrorModel(NOT_FOUND, ex.getLocalizedMessage());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler({ConstraintViolationException.class})
    public ResponseEntity<Object> handleConstraintViolation(final ConstraintViolationException ex) {
        List<ErrorInfo> errors = new ArrayList<>();
        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            Path propertyPath = violation.getPropertyPath();
            String currentProp = ((PathImpl) propertyPath).getLeafNode().toString();

            errors.add(new ErrorInfo(currentProp, violation.getMessage()));
        }

        ApiErrorModel errorModel = new ApiErrorModel(BAD_REQUEST, ex.getLocalizedMessage(), errors);

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    // 500
    @ExceptionHandler({Exception.class})
    public ResponseEntity<Object> handleAll(final Exception ex) {
        String msg = "☠ Something went wrong ☠";
        logError(msg, ex);

        log.debug("Exception class: {}", ex.getClass().getSimpleName());

        ApiErrorModel errorModel = new ApiErrorModel(INTERNAL_SERVER_ERROR, msg);

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    // Handle CrgExceptions
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<Object> handleNotFound(final RuntimeException ex) {
        ApiErrorModel errorModel = new ApiErrorModel(NOT_FOUND, ex.getLocalizedMessage());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Object> handleBadRequest(final RuntimeException e) {
        BadRequestException ex = (BadRequestException) e;

        ApiErrorModel errorModel = new ApiErrorModel(BAD_REQUEST, ex.getMessage(), ex.getErrors());

        log.error("BAD REQUEST: {}", errorModel.getMessage());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler(PayloadTooLargeException.class)
    public ResponseEntity<Object> handlePayloadTooLarge(final RuntimeException e) {
        PayloadTooLargeException ex = (PayloadTooLargeException) e;

        ApiErrorModel errorModel = new ApiErrorModel(PAYLOAD_TOO_LARGE, ex.getMessage());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<Object> handleConflict(final RuntimeException ex) {
        ApiErrorModel errorModel = new ApiErrorModel(CONFLICT, ex.getLocalizedMessage());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler(value = {ForbiddenException.class, AccessDeniedException.class})
    public ResponseEntity<Object> forbidden(final RuntimeException ex) {
        ApiErrorModel errorModel = new ApiErrorModel(FORBIDDEN, ex.getLocalizedMessage());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler(BindingErrorsException.class)
    public ResponseEntity<Object> bindingHandler(final RuntimeException ex) {
        BindingErrorsException bindEx = (BindingErrorsException) ex;

        ApiErrorModel errorModel = new ApiErrorModel(BAD_REQUEST, bindEx.getMessage(),
                mapBindingErrors(bindEx.getBindingResult()));

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler(CrgValidationException.class)
    public ResponseEntity<Object> crgValidationHandler(final RuntimeException ex) {
        CrgValidationException vEx = (CrgValidationException) ex;

        ApiErrorModel errorModel = new ApiErrorModel(BAD_REQUEST, vEx.getMessage(), vEx.getErrors());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler(EmptyResultDataAccessException.class)
    public ResponseEntity<Object> emptyResultDataExceptionsHandler() {
        ApiErrorModel errorModel = new ApiErrorModel(NO_CONTENT, "No Content");

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler(DataServiceException.class)
    public ResponseEntity<Object> internalExceptionsHandler(final RuntimeException ex) {
        DataServiceException dEx = (DataServiceException) ex;
        ApiErrorModel errorModel = new ApiErrorModel(INTERNAL_SERVER_ERROR, ex.getMessage(), dEx.getErrors());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Object> maxSizeExceptionHandler() {
        String maxUploadSize = environment.getRequiredProperty("spring.servlet.multipart.max-file-size");

        String message = "Maximum upload size exceeded, configured maximum: " + maxUploadSize;
        ApiErrorModel errorModel = new ApiErrorModel(BAD_REQUEST, message);

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<Object> multipartExceptionHandler(final MaxUploadSizeExceededException ex) {
        ApiErrorModel errorModel = new ApiErrorModel(BAD_REQUEST, ex.getLocalizedMessage());

        return new ResponseEntity<>(errorModel, new HttpHeaders(), errorModel.getStatus());
    }

    @ExceptionHandler(SmevRequestException.class)
    public ResponseEntity<ApiSmevErrorModel> smevRequestExceptionHandler(final SmevRequestException ex) {
        var errorModel = new ApiSmevErrorModel(
                BAD_REQUEST,
                ex.getMessage(),
                ex.getBuildMeta(),
                ex.getValidationResult()
        );
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
