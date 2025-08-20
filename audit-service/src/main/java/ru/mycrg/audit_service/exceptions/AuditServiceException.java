package ru.mycrg.audit_service.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
public class AuditServiceException extends RuntimeException {

    public AuditServiceException(String msg) {
        super(msg);
    }
}
