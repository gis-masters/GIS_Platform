package ru.mycrg.gateway.filters;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import ru.mycrg.gateway.exceptions.CrgExceptionModel;

import java.net.SocketTimeoutException;
import java.net.UnknownHostException;

import static org.springframework.http.HttpStatus.*;

@ControllerAdvice
public class ErrorFilter {

    private static final Logger log = LoggerFactory.getLogger(ErrorFilter.class);

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CrgExceptionModel> handle(Exception exception, HttpServletRequest request) {
        Throwable cause = getDeepestCause(exception);

        if (cause instanceof SocketTimeoutException) {
            return ResponseEntity.status(GATEWAY_TIMEOUT)
                                 .body(new CrgExceptionModel(GATEWAY_TIMEOUT, makeReadableMsg(request, cause)));
        }

        if (cause instanceof UnknownHostException) {
            return ResponseEntity.status(BAD_GATEWAY)
                                 .body(new CrgExceptionModel(BAD_GATEWAY, makeReadableMsg(request, cause)));
        }

        log.debug("Something went wrong. Reason: {}", exception.getMessage(), exception);

        return ResponseEntity.status(INTERNAL_SERVER_ERROR)
                             .body(new CrgExceptionModel(INTERNAL_SERVER_ERROR, "Something went wrong"));
    }

    private String makeReadableMsg(HttpServletRequest request, Throwable cause) {
        return "Resource: " + request.getRequestURI() + " Reason: " + cause.getMessage();
    }

    private Throwable getDeepestCause(Throwable exception) {
        Throwable current = exception;
        while (current.getCause() != null && current.getCause() != current) {
            current = current.getCause();
        }

        return current;
    }
}
