package ru.mycrg.gateway.exceptions;

import org.springframework.core.env.Environment;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@ControllerAdvice
public class CrgRestExceptionHandler extends ResponseEntityExceptionHandler {

    private final Environment environment;

    public CrgRestExceptionHandler(Environment environment) {
        this.environment = environment;
    }

    @Override
    protected ResponseEntity<Object> handleMaxUploadSizeExceededException(
            final MaxUploadSizeExceededException ex,
            final HttpHeaders headers,
            final HttpStatusCode status,
            final WebRequest request
    ) {
        String maxUploadSize = environment.getRequiredProperty("spring.servlet.multipart.max-file-size");

        CrgExceptionModel crgExceptionModel = new CrgExceptionModel(BAD_REQUEST,
                "Maximum upload size exceeded, configured maximum: " + maxUploadSize
        );

        return handleExceptionInternal(ex, crgExceptionModel, headers, BAD_REQUEST, request);
    }
}
